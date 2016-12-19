import React from 'react'

import TransactionsNavBar from './transactions/TransactionsNavBar'
import TransactionsListContainer from '../containers/TransactionsListContainer'
import { Header } from './common'


export const Transactions = ({ params }) => {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <Header background="teal" color="white" title="Transactions" />
      <TransactionsNavBar />
      <TransactionsListContainer sort={ params.sort } />
    </div>
  )
}

export default Transactions
