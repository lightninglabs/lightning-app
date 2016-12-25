import React from 'react'
import reactCSS from 'reactcss'

import { Box, Text } from 'lightning-components'
import { Identity, Money } from '../common'

export const TranscationListItem = ({ from, user, to, description, amount,
  currency, status }) => {
  const styles = reactCSS({
    'default': {
      row: {
        direction: 'row',
        padding: 'medium',
        spread: true,
        background: 'white',
        userSelect: 'text',
      },
      left: {
        direction: 'column',
        verticalAlign: 'center',
        minWidth: 0,
        size: 'medium',
      },
      right: {
        direction: 'column',
        verticalAlign: 'center',
        align: 'right',
        minWidth: 150,
        paddingLeft: 'medium',
      },
      focusText: {
        color: 'black',
        size: 'medium',
      },
      descText: {
        size: 'small',
        color: 'light-gray',
        paddingTop: 'xs',
      },
    },
  })

  return (
    <Box style={ styles.row }>
      <Text style={ styles.left }>
        <Box direction="row" style={ styles.focusText }>
          <Identity name={ from } user={ user && user.identity } maxWidth="80%" />
          &nbsp;<Text inline>paid</Text>&nbsp;
          <Identity name={ to } user={ user && user.identity } maxWidth="80%" />
        </Box>
        { description ? (
          <Text style={ styles.descText }>{ description }</Text>
        ) : null }
      </Text>
      <Box style={ styles.right }>
        <Text style={ styles.focusText }>
          <Money sign amount={ amount } currency={ currency } />
        </Text>
        <Text style={ styles.descText }>{ status }</Text>
      </Box>
    </Box>
  )
}

export default TranscationListItem
