
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
  decodePaymentRequest: () => ({ type: DECODE_PAYMENT_REQUEST }),
  checkPaymentRequest: () => (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.decodePaymentRequest())
        .then(pr => (pr ? resolve() : reject()))
    })
  },
  lightningPayment: paymentRequest => ({ type: LIGHTNING_PAYMENT, paymentRequest }),
  bitcoinPayment: ({ address, amount }) => ({ type: BITCOIN_PAYMENT, address, amount }),
}

export const selectors = {

}
