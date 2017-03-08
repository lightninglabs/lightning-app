import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

import { Icon } from 'lightning-components'
import TransactionsListItem from './TransactionsListItem'

export const TransactionsList = ({ transactions, loading }) => {
  const styles = reactCSS({
    'default': {
      list: {
        borderTop: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      },
      empty: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#bbb',
      },
      emptyLabel: {
        fontSize: 24,
        paddingTop: 10,
      },
    },
  })
  return (
    <div style={ styles.list }>
      { _.map(transactions, transaction => (
        <TransactionsListItem { ...transaction } key={ transaction.id } />
      )) }

      { !transactions.length && !loading ? (
        <div style={ styles.empty }>
          <Icon name="playlist-remove" large />
          <div style={ styles.emptyLabel }>No Transactions Yet</div>
        </div>
      ) : null }
    </div>
  )
}

export default TransactionsList
