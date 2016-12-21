import React from 'react'

import { Box, LinkWithIcon } from 'lightning-components'
import { Link } from 'react-router'
import { Header } from './common'
import ChannelsList from './channels/ChannelsList'

export const Channels = ({ channels, user, currency, sendLightning,
  onCloseChannel }) => {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <Header title="Channels" />

      <Box paddingTop="medium">
        <ChannelsList
          channels={ channels }
          user={ user }
          currency={ currency }
          sendLightning={ sendLightning }
          onCloseChannel={ onCloseChannel }
        />
      </Box>

      <Link to="/channels-create" style={{ textDecoration: 'none' }}>
        <LinkWithIcon
          label="Create Channel"
          icon="arrow-right-bold-circle-outline"
        />
      </Link>
    </div>
  )
}

export default Channels
