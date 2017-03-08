import React from 'react'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { Link } from 'react-router-dom'
import { actions } from './reducer'

import { Head, Page } from '../common'
import Wallet from './Wallet'
import ChannelList from './ChannelList'

export class Accounts extends React.Component {
  componentDidMount() { this.props.onMount() }

  render() {
    const styles = reactCSS({
      default: {
        page: {
          display: 'flex',
          flexDirection: 'column',
        },
        link: {
          fontSize: 12,
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: '#4990E2',
        },
      },
    })
    const createChannel = (
      <Link style={ styles.link } to="/create-channel">Create Channel</Link>
    )
    return (
      <div style={ styles.page }>
        <Wallet />
        <Page>
          <Head
            title="Your Channels"
            body="Channels are like tubes of money used to transfer funds within
            the network"
            right={ createChannel }
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
export { default as CreateChannelPage } from './CreateChannelPage'
