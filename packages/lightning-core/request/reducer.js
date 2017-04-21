import { GRPC } from 'redux-grpc-middleware'
import { actions as POPUP } from 'lightning-popup'
import { decoratePaymentRequest } from '../helpers'

export const FETCH_ADDRESS_REQUEST = 'REQUEST/FETCH_ADDRESS_REQUEST'
export const FETCH_ADDRESS = 'REQUEST/FETCH_ADDRESS'
export const FETCH_ADDRESS_FAILURE = 'REQUEST/FETCH_ADDRESS_FAILURE'
export const GENERATE_PAYMENT_REQUEST = 'REQUEST/GENERATE_PAYMENT_REQUEST'

const initialState = {
  paymentRequest: '',
  address: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADDRESS_REQUEST:
      return { ...state, address: 'Opening Wallet...' }
    case FETCH_ADDRESS:
      return { ...state, address: action.address }
    case FETCH_ADDRESS_FAILURE:
      return { ...state, address: 'Initializing Wallet' }
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
  fetchAddress: () => ({
    [GRPC]: {
      method: 'newWitnessAddress',
      types: [FETCH_ADDRESS_REQUEST, FETCH_ADDRESS, FETCH_ADDRESS_FAILURE],
    },
  }),
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
  getAddress: state => state.address,
}
