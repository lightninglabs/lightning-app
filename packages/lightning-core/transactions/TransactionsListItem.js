import React from 'react'
import reactCSS from 'reactcss'
import { Text, Icon } from 'lightning-components'
import { Money, MoneySign } from '../common'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { actions as accountActions } from '../accounts'
import { store } from 'lightning-store'

export const TransactionsListItem = ({ type, hash, memo, currency, amount, status }) => {
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
        whiteSpace: 'nowrap',
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
        userSelect: 'none',
        cursor: 'default',
      },
      overflow: {
        minWidth: 330,
        wordBreak: 'break-word',
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
          <Text bold>TxID: </Text>{ hash }
        </div>
        {memo && <div style={{ ...styles.small, ...styles.overflow }}>Note: { memo }</div>}
      </div>

      <div style={{ ...styles.details, ...styles.column }}>
        <div style={ styles.big }><Money amount={ amount } currency={ currency } /> <MoneySign currency={ currency } /></div>
        <div style={ styles.small }>{ status }</div>
      </div>
    </div>
  )
}

export default withRouter(connect(
  state => ({
    serverRunning: store.getServerRunning(state),
    isSynced: store.getSyncedToChain(state),
    pubkey: store.getAccountPubkey(state),
    currency: store.getCurrency(state),
    balances: store.getAccountBalances(state),
  }), {
    fetchAccount: accountActions.fetchAccount,
    fetchBalances: accountActions.fetchBalances,
  },
)(TransactionsListItem))
