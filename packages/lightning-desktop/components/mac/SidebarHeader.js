import React from 'react'
import reactCSS from 'reactcss'
import { Link } from 'react-router-dom'

import { Box, Icon, colors } from 'lightning-components'

import TrafficLights from './TrafficLights'

export const SidebarHeader = () => {
  const styles = reactCSS({
    'default': {
      top: {
        borderBottom: `1px solid ${ colors.black }`,
        direction: 'row',
        padding: 'medium',
        color: 'gray',
        spread: true,
      },
      settings: {
        margin: '-4px 0',
      },
    },
  })

  return (
    <Box style={ styles.top }>
      <TrafficLights />
      <div style={ styles.settings }>
        <Link
          to="/settings"
          activeStyle={{ color: colors.teal }}
          style={{ color: colors.gray, cursor: 'pointer' }}
        >
          <Icon small name="settings" />
        </Link>
      </div>
    </Box>
  )
}

export default SidebarHeader
