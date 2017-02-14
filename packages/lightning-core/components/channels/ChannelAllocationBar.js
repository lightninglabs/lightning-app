import React from 'react'
import reactCSS from 'reactcss'

import { Box, Text } from 'lightning-components'

export const ChannelAllocationBar = ({ percentage, status, align }) => {
  const styles = reactCSS({
    'default': {
      wrap: {
        flex: 1,
        direction: 'row',
      },
      bar: {
        boxShadow: 'inset 0 -2px rgba(0,0,0,.1)',
        marginRight: 1,
        marginLeft: 1,
        display: 'flex',
      },
      percentage: {
        opacity: 0.5,
        size: 'large',
        padding: 'small',
        color: 'black',
      },
    },
    'align-left': {
      wrap: {
        align: 'right',
      },
      bar: {
        background: 'blue',
        borderRadius: '2px 0 0 2px',
        width: `${ percentage }%`,
      },
    },
    'align-right': {
      wrap: {
        align: 'left',
      },
      bar: {
        background: 'dark-teal',
        borderRadius: '0 2px 2px 0',
        width: `${ percentage }%`,
      },
    },
    'hide-percentage': {
      percentage: {
        display: 'none',
      },
    },
    'status-pending': {
      bar: {
        background: 'lighter-gray',
      },
    },
  }, {
    'hide-percentage': percentage < 50,
    'status-pending': status === 'pending',
    'align-left': align === 'left',
    'align-right': align === 'right',
  })

  return (
    <Box style={ styles.wrap }>
      <Box style={ styles.bar }>
        <Text style={ styles.percentage }>{ Math.floor(percentage) }%</Text>
      </Box>
    </Box>
  )
}

export default ChannelAllocationBar
