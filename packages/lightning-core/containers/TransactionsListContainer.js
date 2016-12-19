import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions } from '../reducers/transactions'

import TransactionsList from '../components/transactions/TransactionsList'

const mapStateToProps = (state, props) => ({
  transactions: store.getRecentTransactionsByStatus(state, props.sort),
  user: store.getActiveWallet(state),
  currency: store.getCurrency(state),
})

const TransactionsListContainer = connect(
  mapStateToProps,
  actions
)(TransactionsList)

export default TransactionsListContainer
