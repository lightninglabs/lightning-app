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
        borderTop: '1px solid #ddd',
        display: 'flex',
      },
      icon: {
        paddingRight: 13,
        color: '#bbb',
      },
      column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      details: {
        textAlign: 'right',
      },
      text: {
        flex: 1,
        marginRight: 20,
      },
      big: {
        fontSize: 16,
        color: '#333',
        fontWeight: 500,
      },
      sent: {
        fontWeight: 400,
        color: '#999',
      },
      small: {
        marginTop: 4,
        fontSize: 13,
        color: '#999',
      },
      overflow: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: 330,
      },
    },
  })
  return (
    <div>
      { _.map(transactions, transaction => (
        <div style={ styles.item } key={ transaction.id }>
          <div style={{ ...styles.icon, ...styles.column }}>
            <Icon name={ transaction.type === 'bitcoin' ? 'currency-btc' : 'flash' } />
          </div>
          <div style={{ ...styles.text, ...styles.column }}>
            <div style={{ ...styles.big, ...styles.overflow }}>
              { transaction.hash }
            </div>
            { transaction.memo ? (
              <div style={ styles.small }>{ transaction.memo }</div>
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
