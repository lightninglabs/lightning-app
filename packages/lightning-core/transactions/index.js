
import React from 'react'
import { Head, Page } from '../common'

import TransactionsList from './TransactionsList'

const transactions = [
  {
    id: 'af828g32gh7a5g72ds45fg24sa35gra',
    from: 'You',
    to: 'af828g32gh7a5g72ds45fg24sa35gra',
    amount: 23782346,
    status: 'complete',
    date: new Date(),
    type: 'bitcoin',
  }, {
    id: '0dfg86z5f3g546s3f5r78ga76gs75d6',
    from: '0dfg86z5f3g546s3f5r78ga76gs75d6',
    to: 'You',
    amount: 14802312,
    status: 'complete',
    date: new Date(),
    description: 'Some memo here',
    type: 'lightning',
  }, {
    id: 'gra0dfg86z5f3g546s3f5r78ga76afas',
    from: 'You',
    to: 'gra0dfg86z5f3g546s3f5r78ga76afas',
    amount: 123251,
    status: 'complete',
    date: new Date(),
    type: 'bitcoin',
  }, {
    id: '72ds45fg24sa35gs75d6af828g32gh',
    from: '72ds45fg24sa35gs75d6af828g32gh',
    to: 'You',
    amount: 2472114,
    status: 'complete',
    date: new Date(),
    description: 'Some memo here',
    type: 'lightning',
  }, {
    id: 'gra0dfg86z5f3g546s3f5r78ga76afas',
    from: 'You',
    to: 'gra0dfg86z5f3g546s3f5r78ga76afas',
    amount: 123251,
    status: 'complete',
    date: new Date(),
    type: 'bitcoin',
  }, {
    id: '72ds45fg24sa35gs75d6af828g32gh',
    from: '72ds45fg24sa35gs75d6af828g32gh',
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
    <Page>
      <Head
        title="Your Transactions"
        body="This is a list of both lightning and on chain payments
        made from your wallet."
      />
      <TransactionsList transactions={ transactions } />
    </Page>
  )
}

export default Transactions
