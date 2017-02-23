import { GRPC } from 'redux-grpc-middleware'

export const FETCH_ADDRESS = 'REQUEST/FETCH_ADDRESS'

const initialState = {
  address: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADDRESS:
      return { ...state, address: action.user.address }
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
}

export const selectors = {
  getAddress: state => state.address,
}
