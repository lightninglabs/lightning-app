import _ from 'lodash'
import { GRPC } from 'redux-grpc-middleware'

export const FETCH_ACCOUNT = 'ACCOUNTS/FETCH_ACCOUNT'
export const FETCH_BALANCES = 'ACCOUNTS/FETCH_BALANCES'
export const SET_BALANCES = 'ACCOUNTS/SET_BALANCES'
export const FETCH_CHANNELS = 'ACCOUNTS/FETCH_CHANNELS'

const initialState = {
  pubkey: '',
  isSynced: true,
  currency: 'satoshi',
  balances: {
    wallet: 0,
    channel: 0,
  },
  channels: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT:
      return { ...state, pubkey: action.pubkey, isSynced: action.isSynced }
    case SET_BALANCES:
      return { ...state, balances: { ...state.balances, ...action.balances } }
    case FETCH_CHANNELS:
      return { ...state, channels: action.channels }
    default: return state
  }
}

export const actions = {
  fetchAccount: () => ({
    [GRPC]: {
      method: 'getInfo',
      types: FETCH_ACCOUNT,
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
            wallet: wallet.balance * 1000000000, // To SAT
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
  },
  fetchChannels: () => ({
    [GRPC]: {
      method: 'listChannels',
      types: FETCH_CHANNELS,
      schema: data => ({
        transactions: _.map(data.channels, channel => ({
          remotePubkey: channel.remote_pubkey,
          id: channel.chan_id,
          capacity: channel.capacity,
          localBalance: channel.local_balance,
          remoteBalance: channel.remote_balance,
          status: 'pending',
        })),
      }),
    },
  }),
}

export const selectors = {
  getSyncedToChain: state => state.isSynced,
  getAccountPubkey: state => state.pubkey,
  getCurrency: state => state.currency,
  getAccountBalances: state => state.balances,
  getChannels: state => state.channels,
}
