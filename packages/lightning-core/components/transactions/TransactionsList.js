import React from 'react'
import reactCSS from 'reactcss'
import _ from 'lodash'

import { Box, Text, Icon } from 'lightning-components'
import TransactionsListItem from './TransactionsListItem'

export const TransactionList = ({ transactions, user, currency, sort }) => {
  const styles = reactCSS({
    'default': {
      transaction: {
        borderBottom: '1px solid #eee',
      },
    },
  })

  const idToLabel = id => ({
    'recent': 'Recent',
    'in-progress': 'In Progress',
    'complete': 'Complete',
  }[id])

  return (
    <div style={{ flex: 1 }}>
      { _.map(transactions, (transaction, i) => {
        return (
          <div style={ styles.transaction } key={ i }>
            <TransactionsListItem
              { ...transaction }
              user={ user }
              currency={ currency }
            />
          </div>
        )
      }) }
      { transactions.length === 0 ? (
        <Box
          style={{
            height: '100%',
            direction: 'column',
            align: 'center',
            verticalAlign: 'center',
          }}
        >
          <Icon name="history" size="large" color="light-gray" />
          <Box paddingBottom="large" />
          <Text size="large" color="light-gray">
            { `No ${ idToLabel(sort) } Transactions` }
          </Text>
        </Box>
      ) : null }
    </div>
  )
}

export default TransactionList
