import * as TRANSACTIONS from './transactions'

export default function transaction(state, action) {
  switch (action.type) {
    case TRANSACTIONS.STREAMING_TRANSACTION:
    case TRANSACTIONS.GET_BITCOIN: {
      const fromYou = state.amount < 0
      return {
        id: state.tx_hash,
        from: fromYou ? 'You' : state.tx_hash,
        to: fromYou ? state.tx_hash : 'You',
        amount: state.amount * 1000000000,
        status: 'complete',
        date: parseInt(state.time_stamp, 10),
        type: 'bitcoin',
      }
    }
    case TRANSACTIONS.STREAMING_INVOICE:
    case TRANSACTIONS.GET_LIGHTNING: {
      const hash = new Buffer(state.r_preimage, 'base64').toString('hex')
      return {
        id: hash,
        from: hash,
        to: 'You',
        amount: state.value,
        status: state.settled ? 'complete' : 'in-progress',
        description: state.memo,
        date: parseInt(state.creation_date, 10),
        type: 'lightning',
      }
    }
    default: return state
  }
}
