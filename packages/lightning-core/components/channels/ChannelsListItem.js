import React from 'react'
import reactCSS from 'reactcss'
import { remote } from 'electron'

import { Box, Icon, Text } from 'lightning-components'
import { Money, Identity } from '../common'
import ChannelAllocation from './ChannelAllocation'

export const ChannelsListItem = ({ localAllocation, remoteAllocation, user,
  status, currency, remotePubKey, sendLightning, onClose }) => {
  const styles = reactCSS({
    'default': {
      item: {
        direction: 'row',
        padding: 'small',
        verticalAlign: 'center',
      },
      left: {
        flex: 1,
        paddingLeft: 'small',
      },
      center: {
        flex: 3,
        height: 54,
        direction: 'row',
      },
      right: {
        flex: 2,
        textAlign: 'right',
        overflow: 'hidden',
        paddingRight: 'small',
      },

      headText: {
        fontSize: 'medium',
        color: 'black',
        display: 'block',
        overflow: 'hidden',
      },
      subText: {
        fontSize: 'small',
        display: 'block',
        color: 'gray',
      },
    },
  })

  const handleQuickPay = () => sendLightning(remotePubKey, 1000)
  const handleCloseChannel = () => onClose(remotePubKey)

  const { Menu, MenuItem } = remote
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'Close Channel',
    click: handleCloseChannel,
  }))

  const handleMenu = (e) => {
    e.preventDefault()
    menu.popup(e.clientX, e.clientY)
  }

  return (
    <Box style={ styles.item }>
      <Box style={ styles.left }>
        <Text style={ styles.headText }>
          <Identity name={ user && user.identity } user={ user && user.identity } ellipsis />
        </Text>
        <Text style={ styles.subText }>
          { status === 'pending' ? (
            '(pending)'
          ) : (
            <Money sign amount={ localAllocation } currency={ currency } />
          ) }
        </Text>
      </Box>

      <Box style={ styles.center }>
        <ChannelAllocation
          status={ status }
          left={ localAllocation }
          right={ remoteAllocation }
        />
      </Box>

      <Box style={ styles.right }>
        <Text style={ styles.headText }>
          <Identity name={ remotePubKey } user={ user && user.identity } ellipsis />
        </Text>
        <Text style={ styles.subText }>
          <span onClick={ handleQuickPay } style={{ cursor: 'pointer', color: 'rgb(89, 217, 164)' }}>PAY</span> · <Money sign amount={ remoteAllocation } currency={ currency } />
        </Text>
      </Box>

      <Icon name="dots-vertical" color="light-gray" onClick={ handleMenu } />
    </Box>
  )
}

export default ChannelsListItem
