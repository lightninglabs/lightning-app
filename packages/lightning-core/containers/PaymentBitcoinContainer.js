import React from 'react'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions as notificationsActions } from 'lightning-notifications'
import { actions as paymentActions } from '../reducers/payment'

import PaymentBitcoin from '../components/PaymentBitcoin'

const mapStateToProps = state => ({
  currency: store.getCurrency(state),
  form: store.getSendBitcoinForm(state),
  isSynced: store.getSyncedToChain(state),
  address: store.getBitcoinAddress(state),
})

class PaymentBitcoinContainer extends React.Component {
  componentDidMount() { this.props.newWitnessAddress() }

  render() {
    return (
      <PaymentBitcoin { ...this.props } />
    )
  }
}

export default connect(
  mapStateToProps,
  { ...paymentActions, ...notificationsActions }
)(PaymentBitcoinContainer)
