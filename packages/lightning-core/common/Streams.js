import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { actions as notificationActions } from 'lightning-notifications'
import { actions as accountsActions } from '../accounts'
import { actions as transactionsActions } from '../transactions'
import { actions as payActions } from '../pay'

export class Streams extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      // POLL
      this.props.onFetchAccount()
      this.props.onFetchChannels()
    }, 20000)

    const fetchBalance = _.debounce(this.props.onFetchBalances, 2000)

    const transactions = this.props.onSubscribeTransactions()
    transactions.on('data', (data) => {
      this.props.onFetchTransactions()
      this.props.onSuccess(`Transaction ${ data.num_confirmations === 0 ? 'Recieved' : 'Completed' }`)
      fetchBalance()
    })

    const invoices = this.props.onSubscribeInvoices()
    invoices.on('data', () => {
      this.props.onFetchTransactions()
      this.props.onSuccess('Invoice Completed')
      fetchBalance()
    })

    // const payments = this.props.onSubscribePayments()
    //
    // payments.on('data', (transaction) => {
    //   console.log('payment', transaction)
    // })
    //
    // payments.on('error', (error) => {
    //   console.error('SendPayment Error', error)
    //   this.props.onSuccess(error.message)
    // })

    // setTimeout(() => {
    //   payments.write({
    //     payment_request: 'yx55qnhmt7pikxipwa7jxej5s7dd7jnyfi11yuebpferre6bf1ceda' +
    //       '6kjorw1arsm7gnw51cdtusftdw5bs3ygn6q8d9j7nnnw1xwwmyyyyyyyyyyyy8zayq4oiy',
    //   })
    // }, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  render() {
    return null
  }
}

export default connect(
  () => ({}), {
    onFetchAccount: accountsActions.fetchAccount,
    onFetchBalances: accountsActions.fetchBalances,
    onFetchChannels: accountsActions.fetchChannels,
    onSubscribePayments: payActions.subscribePayments,
    onSubscribeTransactions: transactionsActions.subscribeTransactions,
    onSubscribeInvoices: transactionsActions.subscribeInvoices,
    onFetchTransactions: transactionsActions.fetchTransactions,
    onSuccess: notificationActions.addNotification,
  }
)(Streams)
