import React from 'react'
import reactCSS from 'reactcss'

import { Box } from 'lightning-components'

export const ChannelListItem = ({ id, capacity, localBalance, remoteBalance }) => {
  const styles = reactCSS({
    'default': {
      channel: {
        borderBottom: '1px solid #ddd',
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

  const width = `${ (localBalance / capacity) * 100 }%`

  return (
    <div style={ styles.channel }>
      <div style={ styles.split }>
        <div style={ styles.id }>{ id }</div>
        <div style={ styles.status }>{ status }</div>
      </div>

      <div style={ styles.split }>
        <div style={ styles.local }>My Balance: { localBalance }</div>
        <div style={ styles.remote }>Avaliable to Recieve: { remoteBalance }</div>
      </div>

      <Box style={ styles.bar }>
        <Box style={ styles.percent } width={ width } />
      </Box>

    </div>
  )
}

export default ChannelListItem
