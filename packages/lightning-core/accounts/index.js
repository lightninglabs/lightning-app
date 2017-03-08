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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Wallet />
        <Page>
          <Head
            title="Your Channels"
            body="Channels are like tubes of money used to transfer funds within
            the network"
          />
          <ChannelList
            channels={ this.props.channels }
            loading={ this.props.loading }
          />
        </Page>
      </div>
    )
  }
}

export default connect(
  state => ({
    channels: store.getChannels(state),
    loading: store.getChannelsLoading(state),
  }), {
    onMount: actions.fetchChannels,
  }
)(Accounts)

export { default as reducer, actions, selectors } from './reducer'
