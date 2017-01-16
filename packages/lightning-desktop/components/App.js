/* eslint-disable no-console */
import React, { PropTypes } from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { actions as transactionsActions } from 'lightning-core/reducers/transactions'
import { actions as walletsActions } from 'lightning-core/reducers/wallets'
import { actions as notificationsActions, Notifications } from 'lightning-notifications'
import { actions as paymentActions } from 'lightning-core/reducers/payment'

import { Match, Miss, Redirect } from 'react-router'
import ChannelsContainer from 'lightning-core/containers/ChannelsContainer'
import ChannelsCreateContainer from 'lightning-core/containers/ChannelsCreateContainer'
import Payment from 'lightning-core/components/Payment'
import SettingsContainer from 'lightning-core/containers/SettingsContainer'
import SplashContainer from 'lightning-core/containers/SplashContainer'
import TransactionsContainer from 'lightning-core/containers/TransactionsContainer'
import WalletContainer from 'lightning-core/containers/WalletContainer'
import SidebarContainer from 'lightning-core/containers/SidebarContainer'

import { Box } from 'lightning-components'
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

    this.subscribePayments = this.props.subscribePayments()

    this.subscribePayments.on('data', (transaction) => {
      console.log('transaction', transaction)
    })

    // this.subscribePayments.on('status', status => console.log('status', status.code, status))
    this.subscribePayments.on('error', (error) => {
      console.error('SendPayment Error', error)
      this.props.onSuccess(error.message)
    })
    this.subscribePayments.on('end', () => this.subscribePayments.end())

    // setTimeout(() => {
    //   this.subscribePayments.write({
    //     amt: 4000,
    //     dest_string: 'sdg7624dgsd7g4sd765g4sfg',
    //     payment_hash: '765sdv8b764x8b7f35s8d',
    //   })
    // }, 1000)
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

    // eslint-disable-next-line camelcase
    const handleMakePayment = payment_request =>
      this.subscribePayments.write({ payment_request })

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
  {
    ...transactionsActions,
    ...walletsActions,
    ...notificationsActions,
    ...paymentActions,
  }
)(App)
