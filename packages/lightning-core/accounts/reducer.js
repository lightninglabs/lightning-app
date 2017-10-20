import _ from 'lodash'
import { GRPC, SERVER_RUNNING } from 'redux-grpc-middleware'
import { actions as notificationActions } from 'lightning-notifications'

export const FETCH_ACCOUNT = 'ACCOUNTS/FETCH_ACCOUNT'
export const FETCH_BALANCES = 'ACCOUNTS/FETCH_BALANCES'
export const SET_BALANCES = 'ACCOUNTS/SET_BALANCES'
export const REQUEST_CHANNELS = 'ACCOUNTS/REQUEST_CHANNELS'
export const FETCH_CHANNELS = 'ACCOUNTS/FETCH_CHANNELS'
export const FETCH_CHANNELS_FAILURE = 'ACCOUNTS/FETCH_CHANNELS_FAILURE'
export const LIST_PEERS = 'ACCOUNTS/LIST_PEERS'
export const OPEN_CHANNEL = 'ACCOUNTS/OPEN_CHANNEL'
export const CONNECT_PEER = 'ACCOUNTS/CONNECT_PEER'
export const START_CLOSING_CHANNEL = 'ACCOUNTS/START_CLOSING_CHANNEL'
export const CLOSE_CHANNEL = 'ACCOUNTS/CLOSE_CHANNEL'
export const PENDING_CHANNELS = 'ACCOUNTS/PENDING_CHANNELS'
export const FETCH_ACCOUNT_FAILURE = 'ACCOUNTS/FETCH_ACCOUNT_ERROR'

const initialState = {
  pubkey: '',
  isSynced: true,
  serverRunning: false,
  currency: 'satoshi',
  balances: {
    wallet: 0,
    channel: 0,
  },
  channels: [],
  pendingChannels: [],
  loadingChannels: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SERVER_RUNNING:
      return { ...state, serverRunning: true }
    case REQUEST_CHANNELS:
      return { ...state, loadingChannels: true }
    case FETCH_ACCOUNT:
      return { ...state, pubkey: action.pubkey, isSynced: action.isSynced }
    case FETCH_ACCOUNT_FAILURE:
      return { ...state, isSynced: false }
    case SET_BALANCES:
      return { ...state, balances: { ...state.balances, ...action.balances } }
    case PENDING_CHANNELS:
      return {
        ...state,
        pendingChannels: action.pendingChannels,
        balances: {
          ...state.balances,
          limbo: action.limboBalance,
        },
        loadingChannels: false,
      }
    case FETCH_CHANNELS:
      return {
        ...state,
        channels: action.channels,
        loadingChannels: false,
      }
    case START_CLOSING_CHANNEL:
      return {
        ...state,
        channels: _.map(state.channels, (c) => {
          if (c.channelPoint === action.channelPoint) {
            return {
              ...c,
              status: 'closing',
            }
          }
          return c
        }),
      }
    case FETCH_CHANNELS_FAILURE:
      return { ...state, channels: [], loadingChannels: false }
    default: return state
  }
}

export const actions = {
  fetchAccount: () => ({
    [GRPC]: {
      method: 'getInfo',
      types: [null, FETCH_ACCOUNT, FETCH_ACCOUNT_FAILURE],
      schema: account => ({
        pubkey: account.identity_pubkey,
        isSynced: account.synced_to_chain,
      }),
    },
  }),
  fetchBalances: () => (dispatch) => {
    Promise.all([
      dispatch({
        [GRPC]: {
          method: 'walletBalance',
          schema: wallet => ({
            wallet: parseInt(wallet.balance, 10), // To SAT,
          }),
        },
      }),
      dispatch({
        [GRPC]: {
          method: 'channelBalance',
          schema: channel => ({
            channel: parseInt(channel.balance, 10),
          }),
        },
      }),
    ])
    .then((results) => {
      const account = _.reduce(results, _.extend)
      dispatch({
        type: SET_BALANCES,
        balances: {
          wallet: account.wallet,
          channel: account.channel,
        },
      })
    })
    // eslint-disable-next-line no-console
    .catch(console.error)
  },
  pendingChannels: () => ({
    [GRPC]: {
      method: 'pendingChannels',
      types: [null, PENDING_CHANNELS, FETCH_CHANNELS_FAILURE],
      schema: (data) => {
        const decorateChannels = (channels, transform) =>
          _.map(channels, channel => ({
            remotePubkey: channel.remote_node_pub,
            capacity: channel.capacity,
            localBalance: channel.local_balance,
            remoteBalance: channel.remote_balance,
            channelPoint: channel.channel_point,
            ...transform(channel),
          }))

        return {
          pendingChannels: [
            ...decorateChannels(data.pending_open_channels, () => ({ status: 'pending-open' })),
            ...decorateChannels(data.pending_closing_channels, () => ({ status: 'pending-closing' })),
            ...decorateChannels(data.pending_force_closing_channels, () => ({ status: 'pending-force-closing' })),
          ],
          limboBalance: parseInt(data.total_limbo_balance, 0),
        }
      },
    },
  }),
  listChannels: () => ({
    [GRPC]: {
      method: 'listChannels',
      types: [REQUEST_CHANNELS, FETCH_CHANNELS, FETCH_CHANNELS_FAILURE],
      schema: data => ({
        channels: _.map(data.channels, channel => ({
          remotePubkey: channel.remote_pubkey,
          id: channel.chan_id,
          capacity: channel.capacity,
          localBalance: channel.local_balance,
          remoteBalance: channel.remote_balance,
          channelPoint: channel.channel_point,
          active: channel.active,
          status: 'open',
        })),
      }),
    },
  }),
  fetchChannels: () => (dispatch) => {
    dispatch(actions.listChannels())
    dispatch(actions.pendingChannels())
  },
  listPeers: () => ({
    [GRPC]: {
      method: 'listPeers',
      types: LIST_PEERS,
      schema: list => ({
        peers: list.peers || {},
      }),
    },
  }),
  openChannel: ({ pubkey, amount }) => ({
    [GRPC]: {
      method: 'openChannel',
      types: OPEN_CHANNEL,
      params: {
        node_pubkey: new Buffer(pubkey, 'hex'),
        local_funding_amount: amount,
        num_confs: 1,
      },
      stream: true,
    },
  }),
  connectPeer: ({ host, pubkey }) => ({
    [GRPC]: {
      method: 'connectPeer',
      body: {
        addr: { host, pubkey },
      },
      types: CONNECT_PEER,
    },
  }),
  createChannel: ({ ip, amount }) => (dispatch) => {
    return new Promise((resolve, reject) => {
      const [pubkey, host] = ip && ip.split('@')

      const rejectError = (err) => {
        dispatch(notificationActions.addNotification(err.message))
        reject(err.message)
      }

      const handleResolve = () => {
        dispatch(notificationActions.addNotification('Opening Channel'))
        resolve()
      }

      dispatch(actions.listPeers())
        .then(({ peers }) => {
          const peer = _.find(peers, { pub_key: pubkey })

          if (peer) {
            const call = dispatch(actions.openChannel({ pubkey, amount }))
            call.on('data', handleResolve)
            call.on('error', rejectError)
          } else {
            dispatch(actions.connectPeer({ host, pubkey }))
              .then(() => {
                const call = dispatch(actions.openChannel({ pubkey, amount }))
                call.on('data', handleResolve)
                call.on('error', rejectError)
              })
              .catch(rejectError)
          }
        })
        .catch(rejectError)
    })
  },
  startCloseChannel: params => (dispatch) => {
    dispatch({ type: START_CLOSING_CHANNEL, channelPoint: params.channelPoint })
    return dispatch(actions.closeChannel(params))
  },
  closeChannel: ({ channelPoint, force = false }) => {
    const txid = channelPoint.split(':')[0]
    const index = channelPoint.split(':')[1]
    return {
      [GRPC]: {
        method: 'closeChannel',
        types: CLOSE_CHANNEL,
        params: {
          channel_point: {
            funding_txid: new Buffer(txid, 'hex').reverse(),
            output_index: parseInt(index, 10),
          },
          force,
        },
        stream: true,
      },
    }
  },
  push: (...args) =>
    ({ type: '@@router/CALL_HISTORY_METHOD', payload: { method: 'push', args } }),
}

export const selectors = {
  getSyncedToChain: state => state.isSynced,
  getServerRunning: state => state.serverRunning,
  getAccountPubkey: state => state.pubkey,
  getCurrency: state => state.currency,
  getAccountBalances: state => state.balances,
  getChannels: (state) => {
    const channels = [...state.channels, ...state.pendingChannels]
    return channels.length ? channels : []
  },
  getChannelsLoading: state => state.loadingChannels,
}
