/* eslint-disable no-param-reassign */
import _ from 'lodash'
import { GRPC } from 'redux-grpc-middlware'
import transaction from './transaction'

export const GET_TRANSACTIONS_REQUEST = 'TRANSACTIONS/GET_TRANSACTIONS_REQUEST'

export const GET_BITCOIN = 'TRANSACTIONS/GET_BITCOIN'
export const GET_LIGHTNING = 'TRANSACTIONS/GET_LIGHTNING'

export const STREAMING_TRANSACTION = 'TRANSACTIONS/STREAMING_TRANSACTION'
export const STREAMING_INVOICE = 'TRANSACTIONS/STREAMING_INVOICE'

export default function transactions(state = {}, action) {
  switch (action.type) {
    case GET_BITCOIN:
      return _.reduce(action.bitcoin.transactions, (all, t) => {
        all[t.tx_hash] = transaction(t, action)
        return all
      }, { ...state })

    case GET_LIGHTNING:
      return _.reduce(action.lightning.invoices, (all, t) => {
        const id = new Buffer(t.r_preimage, 'base64').toString('hex')
        all[id] = transaction(t, action)
        return all
      }, { ...state })

    case STREAMING_TRANSACTION:
      return {
        ...state,
        [action.transaction.tx_hash]: transaction(action.transaction, action),
      }
    case STREAMING_INVOICE: {
      const id = new Buffer(action.invoice.r_preimage, 'base64').toString('hex')
      return {
        ...state,
        [id]: transaction(action.invoice, action),
      }
    }
    default: return state
  }
}

export const actions = {
  getBitcoinTransactions: () => ({
    [GRPC]: {
      method: 'getTransactions',
      types: [null, GET_BITCOIN],
      model: 'bitcoin',
    },
  }),

  getLightningTransactions: () => ({
    [GRPC]: {
      method: 'listInvoices',
      types: [null, GET_LIGHTNING],
      model: 'lightning',
    },
  }),

  getTransactions: () => (dispatch) => {
    dispatch(actions.getBitcoinTransactions())
    dispatch(actions.getLightningTransactions())
  },

  subscribeTransactions: () => ({
    [GRPC]: {
      method: 'subscribeTransactions',
      stream: true,
    },
  }),

  subscribeInvoices: () => ({
    [GRPC]: {
      method: 'subscribeInvoices',
      stream: true,
    },
  }),

  updateTransaction: transaction => ({ type: STREAMING_TRANSACTION, transaction }), // eslint-disable-line no-shadow, max-len
  updateInvoice: invoice => ({ type: STREAMING_INVOICE, invoice }),
}

export const selectors = {
  getRecentTransactions: (state) => {
    return _.orderBy(state, 'date', 'desc')
  },
  getRecentTransactionsByStatus: (state, status) => {
    const recent = selectors.getRecentTransactions(state)
    const filtered = status === 'recent' ? recent : _.filter(recent, { status })
    return _.take(filtered, 30)
  },
}
