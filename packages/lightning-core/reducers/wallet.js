export const FETCH_BALANCES = 'WALLET/FETCH_BALANCES'
export const SET_AMOUNT = 'WALLET/SET_AMOUNT'

export const initialState = {
  id: 0,
  identity: '',
  amount: {
    blockchain: 0,
    channels: 0,
  },
  address: '',
}

export default function wallet(state = initialState, action) {
  switch (action.type) {
    case SET_AMOUNT: {
      const amount = {
        blockchain: action.amount.walletBalance.balance * 100000000 || 0,
        channels: action.amount.channelBalance.balance || 0,
      }
      return {
        ...state,
        amount: { ...state.amount, ...amount },
      }
    }
    default: return state
  }
}
