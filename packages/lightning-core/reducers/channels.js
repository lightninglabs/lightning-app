import _ from 'lodash'
import { GRPC } from 'redux-grpc-middleware'
import { actions as notificationsActions } from 'lightning-notifications'
import channel, * as CHANNEL from './channel'

export const GET_CHANNELS = 'CHANNELS/GET_CHANNELS'
export const FILL_FORM = 'CHANNELS/FILL_FORM'
export const LIST_PEERS = 'CHANNELS/LIST_PEERS'

export const OPEN_CHANNEL_REQUEST = 'CHANNELS/OPEN_CHANNEL_REQUEST'
export const OPEN_CHANNEL = 'CHANNELS/OPEN_CHANNEL'
export const OPEN_CHANNEL_FAILURE = 'CHANNELS/OPEN_CHANNEL_FAILURE'

export const CONNECT_PEER_REQUEST = 'CHANNELS/CONNECT_PEER_REQUEST'
export const CONNECT_PEER = 'CHANNELS/CONNECT_PEER'
export const CONNECT_PEER_FAILURE = 'CHANNELS/CONNECT_PEER_FAILURE'

export default function channels(state = [], action) {
  switch (action.type) {
    case GET_CHANNELS:
      return _.map(action.listChannels.channels, c => ({
        total: parseInt(c.local_balance, 10) + parseInt(c.remote_balance, 10),
        localAllocation: parseInt(c.local_balance, 10),
        remoteAllocation: parseInt(c.remote_balance, 10),
        remotePubKey: c.remote_pubkey,
        status: 'open',
      }))
    case CHANNEL.CREATE_CHANNEL:
      return [...state, channel({}, action)]
    default: return state
  }
}

export const actions = {
  fillCreateForm: create => ({ type: FILL_FORM, create }),

  getChannels: () => ({
    [GRPC]: {
      method: 'listChannels',
      types: [null, GET_CHANNELS, null],
    },
  }),

  openChannel: (pubKey, amount) => ({
    [GRPC]: {
      method: 'openChannel',
      body: {
        node_pubkey_string: pubKey,
        local_funding_amount: amount,
        num_confs: 1,
      },
      types: [OPEN_CHANNEL_REQUEST, OPEN_CHANNEL, OPEN_CHANNEL_FAILURE],
    },
  }),

  listPeers: () => ({
    [GRPC]: {
      method: 'listPeers',
      types: [null, LIST_PEERS],
    },
  }),

  connectPeer: (host, pubkey) => ({
    [GRPC]: {
      method: 'connectPeer',
      body: {
        addr: { host, pubkey },
      },
      types: [CONNECT_PEER_REQUEST, CONNECT_PEER, CONNECT_PEER_FAILURE],
    },
  }),

  createChannel: data => (dispatch) => {
    const [pubkey, host] = data.host && data.host.split('@')

    dispatch(actions.listPeers())
      .then(({ listPeers }) => {
        const peer = _.find(listPeers.peers, { pub_key: pubkey })

        if (peer) {
          dispatch(actions.openChannel(pubkey, data.amount))
        } else {
          dispatch(actions.connectPeer(host, pubkey))
            .then(() => {
              dispatch(actions.openChannel(pubkey, data.amount))
            })
            .catch(err => dispatch(notificationsActions.addNotification(err.message)))
        }
      })
      .catch(err => dispatch(notificationsActions.addNotification(err.message)))
  },
}

export const selectors = {
  getChannels: state => state,
}
