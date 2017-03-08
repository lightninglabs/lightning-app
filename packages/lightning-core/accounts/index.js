import React from 'react'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions } from './reducer'

import { Head, Page } from '../common'
import Wallet from './Wallet'
import ChannelList from './ChannelList'

export class Accounts extends React.Component {
  componentDidMount() { this.props.onMount() }

  render() {
    return (
      <div>
        <Wallet />
        <Page>
          <Head
            title="Your Channels"
            body="Channels are like a series of tubes that send money back and
            forth to other people on the network"
          />
          <ChannelList channels={ this.props.channels } />
        </Page>
      </div>
    )
  }
}

export default connect(
  state => ({
    channels: store.getChannels(state),
  }), {
    onMount: actions.fetchChannels,
  }
)(Accounts)

export { default as reducer, actions, selectors } from './reducer'
