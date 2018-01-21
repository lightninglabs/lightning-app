import { GRPC } from 'redux-grpc-middleware'
import { actions as POPUP } from 'lightning-popup'
import { decoratePaymentRequest } from '../helpers'

export const GENERATE_PAYMENT_REQUEST = 'REQUEST/GENERATE_PAYMENT_REQUEST'

const initialState = {
  paymentRequest: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case POPUP.CLOSE_POPUP: {
      if (action.name === 'paymentRequest') {
        return { ...state, paymentRequest: '' }
      }
      return state
    }
    case GENERATE_PAYMENT_REQUEST:
      return { ...state, paymentRequest: decoratePaymentRequest(action.paymentRequest) }
    default: return state
  }
}

export const actions = {
  generatePaymentRequest: ({ amount, note }) => ({
    [GRPC]: {
      method: 'addInvoice',
      body: {
        memo: note,
        value: amount,
      },
      schema: data => ({
        paymentRequest: data.payment_request,
      }),
      types: GENERATE_PAYMENT_REQUEST,
    },
  }),
}

export const selectors = {
  getPaymentRequest: state => state.paymentRequest,
}
