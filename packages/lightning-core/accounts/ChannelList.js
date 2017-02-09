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
          { channel.id }
        </div>
      )) }
    </div>
  )
}

export default ChannelList
