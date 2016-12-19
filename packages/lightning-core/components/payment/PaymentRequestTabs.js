import React from 'react'
import reactCSS from 'reactcss'

import { Box, Tabs, colors } from 'lightning-components'

export const PaymentRequestTabs = ({ selected, onTabChange }) => {
  const styles = reactCSS({
    'default': {
      bar: {
        background: 'lightest-gray',
        height: 48,
      },
      tabs: {
        color: colors.black,
        inactive: colors.black,
      },
    },
  })

  const tabs = [
    {
      label: 'Lightning',
      value: 'lightning',
      href: '/payment/lightning',
    },
    {
      label: 'Bitcoin',
      value: 'bitcoin',
      href: '/payment/bitcoin',
    },
  ]

  return (
    <Box style={ styles.bar }>
      <Tabs
        { ...styles.tabs }
        tabs={ tabs }
        selected={ selected }
        onChange={ onTabChange }
      />
    </Box>
  )
}

export default PaymentRequestTabs
