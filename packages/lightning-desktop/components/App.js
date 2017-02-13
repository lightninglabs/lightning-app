/* eslint-disable no-console */
import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { actions as transactionsActions } from 'lightning-core/reducers/transactions'
import { actions as walletsActions } from 'lightning-core/reducers/wallets'
import { actions as notificationsActions, Notifications } from 'lightning-notifications'
import { actions as paymentActions } from 'lightning-core/reducers/payment'

import { Route, Switch, Redirect } from 'react-router-dom'
import ChannelsContainer from 'lightning-core/containers/ChannelsContainer'
import ChannelsCreateContainer from 'lightning-core/containers/ChannelsCreateContainer'
import Payment from 'lightning-core/components/Payment'
import SettingsContainer from 'lightning-core/containers/SettingsContainer'
import SplashContainer from 'lightning-core/containers/SplashContainer'
import TransactionsContainer from 'lightning-core/containers/TransactionsContainer'
import WalletContainer from 'lightning-core/containers/WalletContainer'
import SidebarContainer from 'lightning-core/containers/SidebarContainer'

import { PayPage, RequestPage, AccountsPage, TransactionsPage } from 'lightning-core'

import { Box } from 'lightning-components'
import SidebarHeader from './mac/SidebarHeader'

export class App extends React.Component {  // eslint-disable-line
  componentDidMount() {
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
          <SidebarContainer />
        </Box>
        <Box style={ styles.content }>

          <Switch>
            <Route pattern="/transactions2/:sort" component={ TransactionsContainer } />

            <Route pattern="/payment" render={ () => <Payment makePayment={ handleMakePayment } /> } />

            <Route pattern="/wallets" component={ WalletContainer } />

            <Route pattern="/splash" component={ SplashContainer } />

            <Route pattern="/channels" component={ ChannelsContainer } />
            <Route pattern="/channels-create" component={ ChannelsCreateContainer } />

            <Route pattern="/settings" component={ SettingsContainer } />

            <Route pattern="/pay" component={ PayPage } />
            <Route pattern="/request" component={ RequestPage } />
            <Route pattern="/accounts" component={ AccountsPage } />
            <Route pattern="/transactions" component={ TransactionsPage } />

            <Route render={ () => <Redirect to="/transactions2/recent" /> } />
          </Switch>

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
