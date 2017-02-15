import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

import { Box } from 'lightning-components'

export const ChannelList = ({ channels }) => {
  const styles = reactCSS({
    'default': {
      channel: {
        borderTop: '1px solid #ddd',
        paddingTop: 20,
        paddingBottom: 20,
      },
      split: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 7,
      },
      id: {
        color: '#333',
        fontSize: 20,
      },
      status: {
        fontSize: 13,
        textTransform: 'uppercase',
        color: '#999',
      },
      local: {
        fontSize: 16,
        color: '#4990E2',
      },
      remote: {
        fontSize: 16,
        color: '#666',
      },
      bar: {
        borderRadius: 2,
        background: 'lighter-gray',
        marginTop: 10,
      },
      percent: {
        background: 'blue',
        height: 12,
        borderRadius: 2,
      },
    },
  })
  return (
    <div>
      { _.map(channels, (channel, i) => {
        const width = `${ (channel.localBalance / channel.capacity) * 100 }%`
        return (
          <div style={ styles.channel } key={ i }>
            <div style={ styles.split }>
              <div style={ styles.id }>{ channel.id }</div>
              <div style={ styles.status }>{ channel.status }</div>
            </div>

            <div style={ styles.split }>
              <div style={ styles.local }>My Balance: { channel.localBalance }</div>
              <div style={ styles.remote }>Avaliable to Recieve: { channel.remoteBalance }</div>
            </div>

            <Box style={ styles.bar }>
              <Box style={ styles.percent } width={ width } />
            </Box>

          </div>
        )
      }) }
    </div>
  )
}

export default ChannelList
