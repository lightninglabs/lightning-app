import { GRPC } from 'redux-grpc-middleware'
import _ from 'lodash'
import { combineReducers } from 'redux'
import wallet, * as WALLET from './wallet'

export const FETCH = 'WALLETS/FETCH'
export const SWITCH_WALLET = 'WALLETS/SWITCH_WALLET'

export function wallets(state = [WALLET.initialState], action) {
  switch (action.type) {
    case WALLET.SET_AMOUNT:
      return [
        wallet(state[0], action),
      ]
    default: return state
  }
}

const initialWalletState = {
  activeWalletIndex: 0,
}

export function ui(state = initialWalletState, action) {
  switch (action.type) {
    case SWITCH_WALLET:
      return { ...state, activeWalletIndex: action.activeWalletIndex }
    default: return state
  }
}

export default combineReducers({
  wallets,
  ui,
})

export const actions = {
  walletBalance: () => ({
    [GRPC]: {
      method: 'walletBalance',
    },
  }),

  channelBalance: () => ({
    [GRPC]: {
      method: 'channelBalance',
    },
  }),

  fetchBalances: () => (dispatch) => {
    Promise.all([
      dispatch(actions.walletBalance()),
      dispatch(actions.channelBalance()),
    ])
    .then((results) => {
      const amount = _.reduce(results, _.extend)
      dispatch({ type: WALLET.SET_AMOUNT, amount })
    })
  },
  switchWallet: activeWalletIndex => ({ type: SWITCH_WALLET, activeWalletIndex }),
}

export const selectors = {
  getWallets: state => state.wallets,
  getActiveWallet: state => state.wallets[state.ui.activeWalletIndex],
  getActiveWalletIndex: state => state.ui.activeWalletIndex,
}
