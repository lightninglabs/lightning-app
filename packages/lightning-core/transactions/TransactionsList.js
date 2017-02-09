import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

import { Icon } from 'lightning-components'

export const TransactionsList = ({ transactions }) => {
  const styles = reactCSS({
    'default': {
      item: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        borderTop: '1px solid #ddd',
        display: 'flex',
      },
      icon: {
        paddingLeft: 13,
        paddingRight: 13,
        color: '#999',
      },
      column: {
        display: 'flex',
        flexDirection: 'column',
        verticalAlign: 'center',
      },
      details: {
        marginLeft: 'auto',
        textAlign: 'right',
      },
      big: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
      },
      small: {
        fontSize: 13,
        color: '#999',
      },
    },
  })
  return (
    <div>
      { _.map(transactions, (transaction, i) => (
        <div style={ styles.item } key={ i }>
          <div style={{ ...styles.icon, ...styles.column }}>
            <Icon name={ transaction.type === 'bitcoin' ? 'currency-btc' : 'flash' } />
          </div>
          <div style={ styles.column }>
            <div style={ styles.big }>{ transaction.from } sent { transaction.to }</div>
            { transaction.description ? (
              <div style={ styles.small }>{ transaction.description }</div>
            ) : null }
          </div>

          <div style={{ ...styles.details, ...styles.column }}>
            <div style={ styles.big }>{ transaction.amount } SAT</div>
            <div style={ styles.small }>{ transaction.status }</div>
          </div>
        </div>
      )) }
    </div>
  )
}

export default TransactionsList
