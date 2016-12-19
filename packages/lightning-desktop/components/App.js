/* eslint-disable no-console */
import React, { PropTypes } from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { actions as transactionsActions } from 'lightning-core/src/reducers/transactions'
import { actions as walletsActions } from 'lightning-core/src/reducers/wallets'
import { actions as notificationsActions, Notifications } from 'lightning-notifications'

import { Match, Miss, Redirect } from 'react-router'
import ChannelsContainer from 'lightning-core/src/containers/ChannelsContainer'
import ChannelsCreateContainer from 'lightning-core/src/containers/ChannelsCreateContainer'
import Payment from 'lightning-core/src/components/Payment'
import SettingsContainer from 'lightning-core/src/containers/SettingsContainer'
import SplashContainer from 'lightning-core/src/containers/SplashContainer'
import TransactionsContainer from 'lightning-core/src/containers/TransactionsContainer'
import WalletContainer from 'lightning-core/src/containers/WalletContainer'
import SidebarContainer from 'lightning-core/src/containers/SidebarContainer'

import { Box } from 'lightning-core-ui'
import SidebarHeader from './mac/SidebarHeader'

export class App extends React.Component {  // eslint-disable-line
  static contextTypes = {
    history: PropTypes.shape({
      listen: PropTypes.func,
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }),
    }),
  }

  componentDidMount() {
    this.context.history.listen((data) => {
      this.props.dispatch({ type: 'ROUTE_CHANGE', ...data })
    })

    const fetchBalance = _.debounce(() => {
      this.props.fetchBalances()
    }, 2000)

    const transactions = this.props.subscribeTransactions()
    transactions.on('data', (transaction) => {
      this.props.dispatch(transactionsActions.updateTransaction(transaction))
      this.props.onSuccess('Transaction Completed')
      fetchBalance()
    })

    const invoices = this.props.subscribeInvoices()
    invoices.on('data', (invoice) => {
      this.props.dispatch(transactionsActions.updateInvoice(invoice))
      this.props.onSuccess('Invoice Completed')
      fetchBalance()
    })
  }

  render() {
    const pathname = this.context.history.location.pathname
    const activeTab = pathname.split('/')[1]

    const styles = reactCSS({
      'default': {
        app: {
          direction: 'row',
          absolute: '0 0 0 0',
          WebkitAppRegion: 'drag',
          fontFamily: '"Roboto", "Helvetica", sans-serif',
          overflow: 'hidden',
        },
        sidebar: {
          direction: 'column',
          width: '170px',
        },
        content: {
          background: 'off-white',
          flex: '1',
          overflowY: 'scroll',
          display: 'flex',
        },
      },
    })

    return (
      <Box style={ styles.app }>
        <Box style={ styles.sidebar }>
          <SidebarHeader />
          <SidebarContainer activeTab={ activeTab } />
        </Box>
        <Box style={ styles.content }>

          <Miss render={ () => <Redirect to="/transactions/recent" /> } />
          <Match pattern="/transactions/:sort" component={ TransactionsContainer } />

          <Match pattern="/payment" component={ Payment } />

          <Match pattern="/wallets" component={ WalletContainer } />

          <Match pattern="/splash" component={ SplashContainer } />

          <Match pattern="/channels" component={ ChannelsContainer } />
          <Match pattern="/channels-create" component={ ChannelsCreateContainer } />

          <Match pattern="/settings" component={ SettingsContainer } />

        </Box>
        <Notifications />
      </Box>
    )
  }
}

export default connect(
  () => ({}),
  { ...transactionsActions, ...walletsActions, ...notificationsActions }
)(App)
