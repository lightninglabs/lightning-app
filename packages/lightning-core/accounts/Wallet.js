import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { actions as accountActions } from '../accounts'
import { store } from 'lightning-store'
import { Money, MoneySign } from '../common'
import { total } from '../helpers'
import { Text } from 'lightning-components'

export const Wallet = ({ pubkey, currency, balances }) => {
  const styles = reactCSS({
    'default': {
      bg: {
        background: '#4990E2',
        color: '#fff',
        padding: 30,
        paddingBottom: 20,
      },
      title: {
        color: 'rgba(0,0,0,0.4)',
        fontSize: 24,
        userSelect: 'none',
        cursor: 'default',
      },
      details: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      total: {

      },
      amount: {
        fontSize: 32,
        marginBottom: 10,
      },
      address: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.4)',
        minWidth: 300,
        wordBreak: 'break-word',
        marginRight: 20,
        marginBottom: 10,
      },
      breakdown: {
        fontSize: 16,
      },
      item: {
        display: 'flex',
        marginBottom: 10,
      },
      label: {
        color: 'rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
        marginRight: 10,
        width: 90,
        userSelect: 'none',
        cursor: 'default',
      },
      count: {
        flex: 1,
        color: 'reba(255,255,255,0.9)',
        whiteSpace: 'nowrap',
      },
    },
  })

  const breakdown = [
    {
      label: 'On Chain',
      amount: balances.wallet,
    }, {
      label: 'In Channels',
      amount: balances.channel,
    },
  ]

  if (balances.limbo) {
    breakdown.push({
      label: 'In Limbo',
      amount: balances.limbo,
    })
  }

  return (
    <div style={ styles.bg }>
      <div style={ styles.title }>Your Wallet</div>
      <div style={ styles.details }>
        <div style={ styles.total }>
          <div style={ styles.amount }>
            <Money amount={ total(balances) } currency={ currency } /> <MoneySign currency={ currency } />
          </div>
          <div style={ styles.address }><Text bold>Pubkey: </Text>{ pubkey }</div>
        </div>
        <div style={ styles.breakdown }>

          { _.map(breakdown, (item, i) => (
            <div style={ styles.item } key={ i }>
              <div style={ styles.label }>
                { item.label }
              </div>
              <div style={ styles.count }>
                <Money amount={ item.amount } currency={ currency } /> <MoneySign currency={ currency } />
              </div>
            </div>
          )) }

        </div>
      </div>
    </div>
  )
}
export default withRouter(connect(
  state => ({
    serverRunning: store.getServerRunning(state),
    isSynced: store.getSyncedToChain(state),
    currency: store.getCurrency(state),
    balances: store.getAccountBalances(state),
  }), {
    fetchAccount: accountActions.fetchAccount,
    fetchBalances: accountActions.fetchBalances,
  },
)(Wallet))
