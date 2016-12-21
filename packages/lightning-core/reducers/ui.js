import { GRPC } from 'redux-grpc-middleware'
import * as PAYMENT from './payment'
import * as CHANNELS from './channels'

export const CHANGE_CURRENCY = 'UI/CHANGE_CURRENCY'

export const GET_ACCOUNT_REQUEST = 'UI/GET_ACCOUNT_REQUEST'
export const GET_ACCOUNT = 'UI/GET_ACCOUNT'
export const GET_ACCOUNT_FAILURE = 'UI/GET_ACCOUNT_FAILURE'

export const SUBSCRIBE_TRANSACTIONS = 'UI/SUBSCRIBE_TRANSACTIONS'

export const QR_OPEN = 'UI/QR_OPEN'
export const QR_CLOSE = 'UI/QR_CLOSE'

export const initialState = {
  currency: 'satoshi',
  account: {
    pubKey: '',
    lnid: '',
    syncedToChain: true,
  },
  channelsCreateForm: {
    host: '',
    amount: '',
  },
  sendBitcoinForm: {
    to: '',
    amount: '',
    note: '',
  },
  sendLightningForm: {
    amount: 0,
    pubkey: '',
    rHash: '',
  },
  requestLightningForm: {
    amount: '',
    note: '',
    uri: '',
  },
  sendLightningURI: '',
  QRVisible: false,
}

export default function ui(state = initialState, action) {
  switch (action.type) {
    case PAYMENT.SEND_PAYMENT:
    case PAYMENT.SEND_BITCOIN:
    case 'ROUTE_CHANGE':
      return {
        ...state,
        requestLightningForm: initialState.requestLightningForm,
        sendLightningForm: initialState.sendLightningForm,
        sendBitcoinForm: initialState.sendBitcoinForm,
        channelsCreateForm: initialState.channelsCreateForm,
        sendLightningURI: initialState.sendLightningURI,
      }
    case CHANGE_CURRENCY:
      return { ...state, currency: action.currency }
    case CHANNELS.FILL_FORM:
      return { ...state, channelsCreateForm: action.create }
    case PAYMENT.CHANGE_BITCOIN_FORM:
      return { ...state, sendBitcoinForm: { ...state.sendBitcoinForm, ...action.data } }
    case PAYMENT.CHANGE_LIGHTNING_FORM:
      return { ...state, requestLightningForm: { ...state.requestLightningForm, ...action.data } }
    case PAYMENT.CHANGE_LIGHTNING_SEND_URI: {
      const [, amount, pubkey, rHash] = action.uri.split(',')
      return {
        ...state,
        requestLightningForm: initialState.requestLightningForm,
        sendLightningURI: action.uri,
        sendLightningForm: { amount, pubkey, rHash },
      }
    }
    case PAYMENT.CREATE_INVOICE: {
      const rHashHex = new Buffer(action.invoice.r_hash, 'base64').toString('hex')
      const uri = `lightning,${ action.amount },${ action.pubkey },${ rHashHex }`
      return {
        ...state,
        requestLightningForm: {
          amount: '',
          note: '',
          uri,
        },
      }
    }
    case GET_ACCOUNT:
      return {
        ...state,
        account: {
          pubKey: action.account.identity_pubkey,
          lnid: action.account.lightning_id,
          syncedToChain: true || action.account.synced_to_chain,
        },
      }
    case GET_ACCOUNT_FAILURE:
      return { ...state, account: { pubKey: 'No Pubkey' } }
    case QR_OPEN:
      return { ...state, QRVisible: true }
    case QR_CLOSE:
      return { ...state, QRVisible: false }
    default: return state
  }
}

export const actions = {
  changeCurrency: currency => ({ type: CHANGE_CURRENCY, currency }),

  fetchAccount: () => ({
    [GRPC]: {
      method: 'getInfo',
      types: [GET_ACCOUNT_REQUEST, GET_ACCOUNT, GET_ACCOUNT_FAILURE],
      model: 'account',
    },
  }),

  subscribeTransactions: () => ({
    [GRPC]: {
      method: 'subscribeTransactions',
      types: [null, SUBSCRIBE_TRANSACTIONS, null],
    },
  }),

  onQROpen: () => ({ type: QR_OPEN }),
  onQRClose: () => ({ type: QR_CLOSE }),
}

export const selectors = {
  getSyncedToChain: state => state.account.syncedToChain,
  getCurrency: state => state.currency,
  getAccountInfo: state => state.account,
  getSendLightningForm: state => state.sendLightningForm,
  getChannelsCreateForm: state => state.channelsCreateForm,
  getSendBitcoinForm: state => state.sendBitcoinForm,
  getRequestLightningForm: state => state.requestLightningForm,
  getSendLightningURI: state => state.sendLightningURI,
  getQRVisible: state => state.QRVisible,
}
