import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

export const Wallet = () => {
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
        marginBottom: 4,
      },
      address: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.4)',
        width: 250,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
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
        flex: 1,
        color: 'rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
        marginRight: 10,
        width: 100,
      },
      count: {
        flex: 1,
        color: 'reba(255,255,255,0.9)',
      },
    },
  })

  const breakdown = [
    {
      label: 'On Chain',
      amount: '67,122,927',
    }, {
      label: 'In Channels',
      amount: '53,832,471',
    }, {
      label: 'Frozen',
      amount: '2,510',
    },
  ]

  return (
    <div style={ styles.bg }>
      <div style={ styles.title }>Your Wallet</div>
      <div style={ styles.details }>
        <div style={ styles.total }>
          <div style={ styles.amount }>
            111,245,170 SAT
          </div>
          <div style={ styles.address }>
            7edb32d4ffd7a7edb32d4ffd7a7f730asd86sa8s65dfgedb
          </div>
        </div>
        <div style={ styles.breakdown }>

          { _.map(breakdown, (item, i) => (
            <div style={ styles.item } key={ i }>
              <div style={ styles.label }>
                { item.label }
              </div>
              <div style={ styles.count }>
                { item.amount }
              </div>
            </div>
          )) }

        </div>
      </div>
    </div>
  )
}

export default Wallet
