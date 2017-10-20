import React from 'react'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { Head, Page } from '../common'
import { actions } from './reducer'

import TransactionsList from './TransactionsList'

export class Transactions extends React.Component {
  componentDidMount() { this.props.onFetchTransactions() }

  render() {
    const { loading, transactions } = this.props
    return (
      <Page>
        <Head
          title="Your Transactions"
          body="This is a list of payments, including Lightning and on-chain
                transactions, sent to or from your wallet."
        />
        <TransactionsList transactions={ transactions } loading={ loading } />
      </Page>
    )
  }
}

export default connect(
  state => ({
    loading: store.getTransactionsLoading(state),
    transactions: store.getRecentTransactions(state),
  }), {
    onFetchTransactions: actions.fetchTransactions,
  },
)(Transactions)

export { default as reducer, actions, selectors } from './reducer'
