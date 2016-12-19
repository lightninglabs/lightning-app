import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../reducers/transactions'

import Transactions from '../components/Transactions'

const mapStateToProps = () => ({

})

class TransactionsContainer extends React.Component {
  componentDidMount() { this.props.getTransactions() }

  render() {
    return (
      <Transactions { ...this.props } />
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(TransactionsContainer)
