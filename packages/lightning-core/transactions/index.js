
import React from 'react'
import { Head } from '../common'

import TransactionsList from './TransactionsList'

const transactions = [
  {
    id: 'state.tx_hash',
    from: 'You',
    to: 'state.tx_hash',
    amount: 23782346,
    status: 'complete',
    date: new Date(),
    type: 'bitcoin',
  }, {
    id: 'state.tx_hash',
    from: 'state.tx_hash',
    to: 'You',
    amount: 14802312,
    status: 'complete',
    date: new Date(),
    description: 'Some memo here',
    type: 'lightning',
  }, {
    id: 'state.tx_hash',
    from: 'You',
    to: 'state.tx_hash',
    amount: 123251,
    status: 'complete',
    date: new Date(),
    type: 'bitcoin',
  }, {
    id: 'state.tx_hash',
    from: 'state.tx_hash',
    to: 'You',
    amount: 2472114,
    status: 'complete',
    date: new Date(),
    description: 'Some memo here',
    type: 'lightning',
  },
]

export const Transactions = () => {
  return (
    <div>
      <div style={{ paddingTop: 30, paddingRight: 30, paddingLeft: 30 }}>
        <Head
          title="Your Transactions"
          body="This is a list of both lightning and on chain payments
          made from your wallet."
        />
      </div>
      <TransactionsList transactions={ transactions } />
    </div>
  )
}

export default Transactions
