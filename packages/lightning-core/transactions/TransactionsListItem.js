import React from 'react'
import reactCSS from 'reactcss'

import { Icon } from 'lightning-components'

export const TransactionsListItem = ({ type, hash, memo, amount, status }) => {
  const styles = reactCSS({
    'default': {
      item: {
        paddingTop: 20,
        paddingBottom: 20,
        borderBottom: '1px solid #ddd',
        display: 'flex',
        flexShrink: 0,
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
    <div style={ styles.item }>
      <div style={{ ...styles.icon, ...styles.column }}>
        <Icon name={ type === 'bitcoin' ? 'currency-btc' : 'flash' } />
      </div>
      <div style={{ ...styles.text, ...styles.column }}>
        <div style={{ ...styles.big, ...styles.overflow }}>
          { hash }
        </div>
        { memo ? (
          <div style={ styles.small }>{ memo }</div>
        ) : null }
      </div>

      <div style={{ ...styles.details, ...styles.column }}>
        <div style={ styles.big }>{ amount } SAT</div>
        <div style={ styles.small }>{ status }</div>
      </div>
    </div>
  )
}

export default TransactionsListItem
