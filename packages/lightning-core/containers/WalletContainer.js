import React from 'react'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions as uiActions } from '../reducers/ui'
import { actions as walletsActions } from '../reducers/wallets'

import Wallet from '../components/Wallet'

const mapStateToProps = state => ({
  wallets: store.getWallets(state),
  currency: store.getCurrency(state),
  account: store.getAccountInfo(state),
  activeWallet: store.getActiveWalletIndex(state),
})

class WalletContainer extends React.Component {
  componentDidMount() { this.props.fetchBalances() }

  render() {
    return <Wallet { ...this.props } />
  }
}

export default connect(
  mapStateToProps,
  { ...walletsActions, ...uiActions }
)(WalletContainer)
