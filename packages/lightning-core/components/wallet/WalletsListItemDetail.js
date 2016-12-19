import React from 'react'
import reactCSS from 'reactcss'

import { Box, Text } from 'lightning-components'
import { Money } from '../common'

export const WalletsListItemDetail = ({ active, amount, currency, label }) => {
  const styles = reactCSS({
    'default': {
      detail: {
        direction: 'row',
        align: 'right',
        fontSize: 'medium',
        color: 'gray',
      },
      label: {
        width: 80,
        paddingLeft: 'medium',
      },
    },
    'active-false': {
      labelText: {
        'light-gray': true,
      },
    },
  }, { 'active-false': active === false })

  return (
    <Box style={ styles.detail }>
      <Text color="light-gray">
        <Money sign amount={ amount } currency={ currency } />
      </Text>
      <Box style={ styles.label }>
        <Text block>{ label }</Text>
      </Box>
    </Box>
  )
}

export default WalletsListItemDetail
