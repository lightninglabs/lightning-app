import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

export const ChannelList = ({ channels }) => {
  const styles = reactCSS({
    'default': {
      'channel': {
        borderTop: '1px solid #ddd',
        paddingTop: 20,
        paddingBottom: 20,
      },
    },
  })
  return (
    <div>
      { _.map(channels, (channel, i) => (
        <div style={ styles.channel } key={ i }>
          <div>ID: { channel.id }</div>
          <div>Local Balance: { channel.localBalance }</div>
          <div>Remote Balance: { channel.remoteBalance }</div>
          <div>Capacity: { channel.capacity }</div>
          <div>Status: { channel.status }</div>
        </div>
      )) }
    </div>
  )
}

export default ChannelList
