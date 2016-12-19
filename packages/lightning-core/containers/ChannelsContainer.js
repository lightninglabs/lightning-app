import React from 'react'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions as channelsActions } from '../reducers/channels'
import { actions as paymentActions } from '../reducers/payment'

import Channels from '../components/Channels'

const mapStateToProps = state => ({
  user: store.getActiveWallet(state),
  channels: store.getChannels(state),
  currency: store.getCurrency(state),
})

class ChannelsContainer extends React.Component {
  componentDidMount() { this.props.getChannels() }

  render() {
    return (
      <Channels { ...this.props } />
    )
  }
}

export default connect(
  mapStateToProps,
  { ...channelsActions, ...paymentActions }
)(ChannelsContainer)
