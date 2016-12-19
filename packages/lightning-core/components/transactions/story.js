import React from 'react'
import { storiesOf } from '@kadira/storybook'

import TransactionsList from './TransactionsList'
import TransactionsListItem from './TransactionsListItem'
import TransactionsNavBar from './TransactionsNavBar'

const transaction = {
  id: '0',
  from: 'case@casesandberg.com',
  to: 'joseph@lightning.network',
  amount: 0.0021,
  status: 'complete',
  description: 'For a really cool book',
}

const transaction2 = {
  id: '1',
  from: 'stark@lightning.network',
  to: 'case@casesandberg.com',
  amount: 1.4439,
  status: 'complete',
}

const transcationNoDesc = Object.assign({}, transaction, { description: '' })

const user = {
  identity: 'case@casesandberg.com',
}

const currency = 'btc'

storiesOf('TransactionsList', module)
  .add('transactions', () => (
    <TransactionsList
      transactions={ [
        transaction,
        transaction2,
        transcationNoDesc,
        transaction,
        transaction2,
      ] }
      user={ user }
      currency={ currency }
    />
  ))

storiesOf('TransactionsListItem', module)
  .add('transcation', () => (
    <TransactionsListItem { ...transaction } user={ user } currency={ currency } />
  ))
  .add('transcation2', () => (
    <TransactionsListItem { ...transaction2 } user={ user } currency={ currency } />
  ))
  .add('transcation without description', () => (
    <TransactionsListItem { ...transcationNoDesc } user={ user } currency={ currency } />
  ))

storiesOf('TransactionsNavBar', module)
  .add('`recent` selected', () => (
    <TransactionsNavBar selected="recent" />
  ))
  .add('`in-progress` selected', () => (
    <TransactionsNavBar selected="in-progress" />
  ))
  .add('`complete` selected', () => (
    <TransactionsNavBar selected="complete" />
  ))
  .add('`search` selected', () => (
    <TransactionsNavBar selected="search" />
  ))
