import { GRPC } from 'redux-grpc-middleware'
import { actions as notificationActions } from 'lightning-notifications'
import { sanitizePaymentRequest } from '../helpers'

export const DECODE_PAYMENT_REQUEST = 'PAY/DECODE_PAYMENT_REQUEST'
export const CHECK_PAYMENT_REQUEST = 'PAY/CHECK_PAYMENT_REQUEST'
export const LIGHTNING_PAYMENT = 'PAY/LIGHTNING_PAYMENT'
export const BITCOIN_PAYMENT = 'PAY/BITCOIN_PAYMENT'

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
      const rejectError = (err) => {
        dispatch(notificationActions.addNotification(err.message))
        reject(err.message)
      }
      const paymentRequest = sanitizePaymentRequest(address)

      dispatch(actions.decodePaymentRequest({ paymentRequest }))
        .then(() => {
          dispatch(actions.onLightningPayment({ paymentRequest }))
            .then(resolve)
            .catch(rejectError)
        })
        .catch(() => {
          dispatch(actions.bitcoinPayment({ address, amount }))
            .then(resolve)
            .catch(rejectError)
        })
    })
  },
  bitcoinPayment: ({ address, amount }) => ({
    [GRPC]: {
      method: 'sendCoins',
      body: {
        addr: address,
        amount,
      },
      types: BITCOIN_PAYMENT,
    },
  }),
  lightningPayment: ({ paymentRequest }) => ({
    [GRPC]: {
      method: 'sendPayment',
      body: {
        payment_request: paymentRequest,
      },
      types: LIGHTNING_PAYMENT,
    },
  }),
}

export const selectors = {

}
