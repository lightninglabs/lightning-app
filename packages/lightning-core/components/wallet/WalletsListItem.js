import React from 'react'
import reactCSS, { hover as h } from 'reactcss'

import { Box, Text } from 'lightning-components'
import { Money } from '../common'
import WalletsListItemDetail from './WalletsListItemDetail'

import { total } from '../../helpers/wallet'

export const WalletsListItem = ({ active, hover, amount, currency, identity,
  account }) => {
  const styles = reactCSS({
    'default': {
      item: {
        zDepth: active ? 1 : 0,
        padding: 'large',
        paddingRight: 'medium',
        direction: 'row',
        spread: true,
        position: 'relative',
      },

      left: {
        direction: 'column',
        verticalAlign: 'center',
        fontSize: 'medium',
        color: 'gray',
        maxWidth: 300,
      },
      total: {
        size: 'xl',
        color: 'black',
      },

      right: {
        direction: 'column',
        align: 'right',
      },
      switch: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        display: 'none',
      },
    },
    'active': {
      switch: {
        display: 'none',
      },
    },
    'active-false': {
      total: {
        'black': false,
        'light-gray': true,
      },
      identity: {
        'light-gray': true,
      },
    },
    'hover': {
      switch: {
        display: 'flex',
      },
    },
  }, { hover, active, 'active-false': active === false })

  return (
    <Box style={ styles.item }>

      <Box style={ styles.left }>
        <Text style={ styles.total }>
          <Money sign amount={ total(amount) } currency={ currency } />
        </Text>
        <Text ellipsis>{ identity || account.pubKey }</Text>
      </Box>

      <Box style={ styles.right }>
        <WalletsListItemDetail
          amount={ amount.blockchain }
          currency={ currency }
          label="Blockchain"
          active={ active }
        />
        <Box paddingTop="medium" />
        <WalletsListItemDetail
          amount={ amount.channels }
          currency={ currency }
          label="In Channels"
          active={ active }
        />
      </Box>

    </Box>
  )
}

WalletsListItem.defaultProps = {
  active: false,
}

export default h(WalletsListItem)
