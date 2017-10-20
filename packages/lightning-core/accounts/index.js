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
  componentDidMount() {
    this.props.fetchBalances()
    this.props.onMount()
  }

  render() {
    const { pubkey, balances, channels, loading } = this.props
    const styles = reactCSS({
      default: {
        page: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
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
        <Wallet
          pubkey={ pubkey }
          balances={ balances }
        />
        <Page>
          <Head
            title="Your Channels"
            body="Channels are like tubes of money used to send money through the network"
            right={ createChannel }
          />
          <ChannelList
            channels={ channels }
            loading={ loading }
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
    balances: store.getAccountBalances(state),
    pubkey: store.getAccountPubkey(state),
  }), {
    onMount: actions.fetchChannels,
    fetchBalances: actions.fetchBalances,
  },
)(Accounts)

export { default as reducer, actions, selectors } from './reducer'
export { default as CreateChannelPage } from './CreateChannelPage'
