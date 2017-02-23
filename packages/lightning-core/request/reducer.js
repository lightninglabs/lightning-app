import { GRPC } from 'redux-grpc-middleware'
import { actions as POPUP } from 'lightning-popup'
import { decoratedPaymentRequest } from '../helpers'

export const FETCH_ADDRESS = 'REQUEST/FETCH_ADDRESS'
export const GENERATE_PAYMENT_REQUEST = 'REQUEST/GENERATE_PAYMENT_REQUEST'

const initialState = {
  paymentRequest: '',
  address: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADDRESS:
      return { ...state, address: action.user.address }
    case POPUP.CLOSE_POPUP: {
      if (action.name === 'paymentRequest') {
        return { ...state, paymentRequest: '' }
      }
      return state
    }
    case GENERATE_PAYMENT_REQUEST:
      return { ...state, paymentRequest: decoratedPaymentRequest(action.invoice.payment_request) }
    default: return state
  }
}

export const actions = {
  fetchAddress: () => ({
    [GRPC]: {
      method: 'newWitnessAddress',
      types: [null, FETCH_ADDRESS],
      model: 'user',
    },
  }),
  generatePaymentRequest: ({ amount, note }) => ({
    [GRPC]: {
      method: 'addInvoice',
      body: {
        memo: note,
        value: amount,
      },
      types: [null, GENERATE_PAYMENT_REQUEST],
      model: 'invoice',
    },
  }),
}

export const selectors = {
  getPaymentRequest: state => state.paymentRequest,
  getAddress: state => state.address,
}
