import { GRPC } from 'redux-grpc-middleware'
import { actions as notificationActions } from 'lightning-notifications'
import { actions as accountsActions } from '../accounts'
import { sanitizePaymentRequest } from '../helpers'

export const DECODE_PAYMENT_REQUEST = 'PAY/DECODE_PAYMENT_REQUEST'
export const CHECK_PAYMENT_REQUEST = 'PAY/CHECK_PAYMENT_REQUEST'
export const LIGHTNING_PAYMENT = 'PAY/LIGHTNING_PAYMENT'
export const BITCOIN_PAYMENT = 'PAY/BITCOIN_PAYMENT'
export const SUBSCRIBE_PAYMENT = 'PAY/SUBSCRIBE_PAYMENT'

const initialState = {

}

export default (state = initialState, action) => {
  switch (action.type) {
    default: return state
  }
}

export const actions = {
  decodePaymentRequest: ({ paymentRequest }) => ({
    [GRPC]: {
      method: 'decodePayReq',
      body: {
        pay_req: paymentRequest,
      },
      types: DECODE_PAYMENT_REQUEST,
    },
  }),
  makePayment: ({ address, amount }) => (dispatch) => {
    return new Promise((resolve, reject) => {
      const resolveSuccess = () => {
        dispatch(notificationActions.addNotification('Payment Sent'))
        dispatch(accountsActions.fetchChannels())
        dispatch(accountsActions.fetchBalances())
        dispatch(accountsActions.fetchAccount())
        resolve('Payment Sent')
      }
      const rejectError = (err) => {
        dispatch(notificationActions.addNotification(err.message))
        reject(err.message)
      }
      const paymentRequest = sanitizePaymentRequest(address)

      dispatch(actions.decodePaymentRequest({ paymentRequest }))
        .then(() => {
          const payments = dispatch(actions.sendPayment())
          payments.on('data', (payment) => {
            if (payment.payment_error === '') {
              resolveSuccess()
            } else {
              // TODO(roasbeef): need to switch and properly display errors
              rejectError({ message: 'Payment route failure' })
            }
          })
          payments.on('error', rejectError)
          payments.write({ payment_request: paymentRequest })
        })
        .catch(() => {
          dispatch(actions.sendCoins({ address, amount }))
            .then(resolve)
            .catch(rejectError)
        })
    })
  },
  sendCoins: ({ address, amount }) => ({
    [GRPC]: {
      method: 'sendCoins',
      body: {
        addr: address,
        amount,
      },
      types: BITCOIN_PAYMENT,
    },
  }),
  sendPayment: () => ({
    [GRPC]: {
      method: 'sendPayment',
      types: LIGHTNING_PAYMENT,
      stream: true,
    },
  }),
  subscribePayments: () => ({
    [GRPC]: {
      method: 'subscribePayments',
      types: SUBSCRIBE_PAYMENT,
      stream: true,
    },
  }),
}

export const selectors = {}
