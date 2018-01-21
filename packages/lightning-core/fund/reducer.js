import { GRPC } from 'redux-grpc-middleware'

export const FETCH_ADDRESS_REQUEST = 'REQUEST/FETCH_ADDRESS_REQUEST'
export const FETCH_ADDRESS = 'REQUEST/FETCH_ADDRESS'
export const FETCH_ADDRESS_FAILURE = 'REQUEST/FETCH_ADDRESS_FAILURE'

const initialState = {
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
}

export const selectors = {
  getAddress: state => state.address,
}
