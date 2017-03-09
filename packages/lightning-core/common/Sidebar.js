import React from 'react'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { store } from 'lightning-store'

import { Box, Text } from 'lightning-components'
import { actions as accountActions } from '../accounts'
import NavLinks from './NavLinks'
import NavFooter from './NavFooter'

export class Sidebar extends React.Component {
  componentDidMount() {
    this.props.fetchAccount()
    this.props.location.pathname !== '/accounts' && this.props.fetchBalances()
  }

  render() {
    const { navigateToSubpage, currency, pubkey, balances, isSynced } = this.props
    const styles = reactCSS({
      'default': {
        sidebar: {
          direction: 'column',
          spread: true,
          flex: 1,
        },
        section: {
          padding: 'small',
        },
        synced: {
          background: 'blue',
          direction: 'column',
          align: 'center',
          verticalAlign: 'center',
          marginLeft: -7,
          marginTop: 7,
          marginRight: -7,
          marginBottom: -7,
          borderBottomLeftRadius: 4,
          height: 34,
        },
        syncedText: {
          color: 'black',
          size: 'small',
        },
      },
    })

    return (
      <Box style={ styles.sidebar }>
        <Box style={ styles.section }>
          <NavLinks onChange={ navigateToSubpage } />
        </Box>
        <Box style={ styles.section }>
          <NavFooter
            balances={ balances }
            pubkey={ pubkey }
            currency={ currency }
            onClickAccount={ navigateToSubpage }
          />
          { isSynced ? null : (
            <Box style={ styles.synced }>
              <Text style={ styles.syncedText }>Syncing to Chain</Text>
            </Box>
          ) }
        </Box>
      </Box>
    )
  }
}

export default withRouter(connect(
  state => ({
    isSynced: store.getSyncedToChain(state),
    pubkey: store.getAccountPubkey(state),
    currency: store.getCurrency(state),
    balances: store.getAccountBalances(state),
  }), {
    fetchAccount: accountActions.fetchAccount,
    fetchBalances: accountActions.fetchBalances,
  }
)(Sidebar))
