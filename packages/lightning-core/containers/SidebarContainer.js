import React from 'react'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions as uiActions } from '../reducers/ui'
import { actions as walletsActions } from '../reducers/wallets'

import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, { activePage }) => ({
  user: store.getActiveWallet(state),
  currency: store.getCurrency(state),
  account: store.getAccountInfo(state),
  isSynced: store.getSyncedToChain(state),
  activePage,
})

export class SidebarContainer extends React.Component {
  componentDidMount() {
    this.props.fetchAccount()
    this.props.activeTab !== 'wallets' && this.props.fetchBalances()
  }

  render() {
    return (
      <Sidebar { ...this.props } />
    )
  }
}

export default connect(
  mapStateToProps,
  { ...uiActions, ...walletsActions }
)(SidebarContainer)
