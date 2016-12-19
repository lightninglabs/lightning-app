import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions as notificationsActions } from 'lightning-notifications'
import { actions as paymentActions } from '../reducers/payment'

import PaymentLightning from '../components/PaymentLightning'

const mapStateToProps = state => ({
  currency: store.getCurrency(state),
  form: store.getRequestLightningForm(state),
  account: store.getAccountInfo(state),
  sendURI: store.getSendLightningURI(state),
  sendLightningForm: store.getSendLightningForm(state),
  isSynced: store.getSyncedToChain(state),
})

const PaymentLightningContainer = connect(
  mapStateToProps,
  { ...paymentActions, ...notificationsActions }
)(PaymentLightning)

export default PaymentLightningContainer
