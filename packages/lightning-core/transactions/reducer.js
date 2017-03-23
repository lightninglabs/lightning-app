import _ from 'lodash'
import { GRPC } from 'redux-grpc-middleware'
import { toHash } from '../helpers'

export const REQUEST = 'TRANSACTIONS/REQUEST'
export const REQUEST_ERROR = 'TRANSACTIONS/REQUEST_ERROR'
export const GET_TRANSACTIONS = 'TRANSACTIONS/GET_TRANSACTIONS'
export const LIST_INVOICES = 'TRANSACTIONS/LIST_INVOICES'
export const LIST_PAYMENTS = 'TRANSACTIONS/LIST_PAYMENTS'

const initialState = {
  loading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST:
      return { ...state, loading: true }
    case GET_TRANSACTIONS:
    case LIST_INVOICES:
    case LIST_PAYMENTS:
      return {
        ...state,
        loading: false,
        list: _.reduce(action.transactions, (all, transaction) => {
        // eslint-disable-next-line no-param-reassign
          all[transaction.id] = transaction
          return all
        }, { ...state.list }),
      }
    case REQUEST_ERROR:
      return { ...state, loading: false, list: [] }
    default: return state
  }
}

export const actions = {
  fetchTransactions: () => (dispatch) => {
    dispatch({
      [GRPC]: {
        method: 'getTransactions',
        types: [REQUEST, GET_TRANSACTIONS, REQUEST_ERROR],
        schema: data => ({
          transactions: _.map(data.transactions, transaction => ({
            id: transaction.tx_hash,
            type: 'bitcoin',
            amount: transaction.amount,
            status: transaction.num_confirmations < 1 ? 'unconfirmed' : 'confirmed',
            date: new Date(parseInt(transaction.time_stamp, 10)),
            hash: transaction.tx_hash,
          })),
        }),
      },
    })
    .catch(() => {})
    dispatch({
      [GRPC]: {
        method: 'listInvoices',
        types: [REQUEST, LIST_INVOICES, REQUEST_ERROR],
        schema: data => ({
          transactions: _.map(data.invoices, invoice => ({
            id: invoice.creation_date,
            type: 'lightning',
            amount: invoice.value,
            status: invoice.settled ? 'complete' : 'in-progress',
            date: new Date(parseInt(invoice.creation_date, 10)),
            memo: invoice.memo,
            hash: toHash(invoice.r_preimage),
          })),
        }),
      },
    })
    .catch(() => {})
    dispatch({
      [GRPC]: {
        method: 'listPayments',
        types: [null, LIST_PAYMENTS, REQUEST_ERROR],
        schema: data => ({
          transactions: _.map(data.payments, payment => ({
            id: payment.creation_date,
            type: 'lightning',
            amount: payment.value,
            status: 'complete',
            date: new Date(parseInt(payment.creation_date, 10)),
            hash: payment.payment_hash,
          })),
        }),
      },
    })
    .catch(() => {})
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
}

export const selectors = {
  getRecentTransactions: state => _.orderBy(state.list, 'date', 'desc'),
  getTransactionsLoading: state => state.loading,
}
