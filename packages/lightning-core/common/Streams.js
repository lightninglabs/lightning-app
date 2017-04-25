/* eslint-disable no-console */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { actions as notificationActions } from 'lightning-notifications'
import { actions as accountsActions } from '../accounts'
import { actions as transactionsActions } from '../transactions'
import { store } from 'lightning-store'

export class Streams extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.serverRunning === false && nextProps.serverRunning === true) {
      this.props.onFetchAccount()

      this.interval = setInterval(() => {
        // POLL
        this.props.onFetchAccount()
        this.props.onFetchChannels()
      }, 20000)

      const fetchBalance = _.debounce(this.props.onFetchBalances, 2000)

      const transactions = this.props.onSubscribeTransactions()
      transactions.on('data', (data) => {
        this.props.onFetchTransactions()
        this.props.onFetchChannels()
        this.props.onFetchAccount()
        this.props.onSuccess(`Transaction ${ data.num_confirmations === 0 ? 'Received' : 'Completed' }`)
        fetchBalance()
      })

      const invoices = this.props.onSubscribeInvoices()
      invoices.on('data', () => {
        this.props.onFetchTransactions()
        this.props.onFetchChannels()
        this.props.onFetchAccount()
        this.props.onSuccess('Invoice Completed')
        fetchBalance()
      })
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  render() {
    return null
  }
}

export default connect(
  state => ({
    serverRunning: store.getServerRunning(state),
  }), {
    onFetchAccount: accountsActions.fetchAccount,
    onFetchBalances: accountsActions.fetchBalances,
    onFetchChannels: accountsActions.fetchChannels,
    onSubscribeTransactions: transactionsActions.subscribeTransactions,
    onSubscribeInvoices: transactionsActions.subscribeInvoices,
    onFetchTransactions: transactionsActions.fetchTransactions,
    onSuccess: notificationActions.addNotification,
  },
)(Streams)
