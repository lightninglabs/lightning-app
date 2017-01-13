export const CREATE_CHANNEL = 'CHANNEL/CREATE_CHANNEL'

export default function channels(state = {}, action) {
  switch (action.type) {
    case CREATE_CHANNEL:
      return {
        total: action.data.amount,
        localAllocation: action.data.amount,
        remoteAllocation: 0,
        remotePubKey: action.data.pubKey,
        status: 'pending', // TODO: Hook this up
      }
    default: return state
  }
}
