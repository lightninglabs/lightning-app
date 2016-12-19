import React from 'react'
import reactCSS from 'reactcss'
import _ from 'lodash'

import { Box, Icon, Text } from 'lightning-components'
import ChannelsListItem from './ChannelsListItem'

export const ChannelsList = ({ channels, currency, user, sendLightning }) => {
  const styles = reactCSS({
    'default': {
      channels: {
        borderTop: '1px solid #eee',
      },
      channel: {
        borderBottom: '1px solid #eee',
      },
      noChannels: {
        borderBottom: '1px solid #eee',
        padding: 'medium',
        direction: 'row',
        verticalAlign: 'center',
      },
    },
  })

  return (
    <div style={ styles.channels }>
      { _.map(channels, (channel, i) => {
        return (
          <div style={ styles.channel } key={ i }>
            <ChannelsListItem
              { ...channel }
              currency={ currency }
              user={ user }
              sendLightning={ sendLightning }
            />
          </div>
        )
      }) }
      { channels.length === 0 ? (
        <Box style={ styles.noChannels }>
          <Icon color="black" size="large" />
          <Box direction="column" paddingLeft="medium">
            <Text size="large" color="black">No Channels Yet</Text>
            <Text size="medium" color="black">Create a Channel Below</Text>
          </Box>
        </Box>
      ) : null }
    </div>
  )
}

export default ChannelsList
