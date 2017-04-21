import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

import { Icon } from 'lightning-components'
import { LoadingIcon } from '../common'
import ChannelListItem from './ChannelListItem'

export const ChannelList = ({ channels, loading }) => {
  const styles = reactCSS({
    'default': {
      list: {
        borderTop: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      },
      empty: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#bbb',
        userSelect: 'none',
        cursor: 'default',
      },
      emptyLabel: {
        fontSize: 24,
        paddingTop: 10,
      },
    },
  })

  return (
    <div style={ styles.list }>
      { _.map(channels, (channel, i) => (
        <ChannelListItem { ...channel } key={ i } />
      )) }

      { loading ? (
        <div style={ styles.empty }>
          <LoadingIcon />
        </div>
      ) : null }

      { !channels.length && !loading ? (
        <div style={ styles.empty }>
          <Icon name="playlist-remove" large />
          <div style={ styles.emptyLabel }>No Channels Yet</div>
        </div>
      ) : null }
    </div>
  )
}

export default ChannelList
