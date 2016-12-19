import React from 'react'
import reactCSS from 'reactcss'

import { Box, Text } from 'lightning-components'
import { Money, Identity } from '../common'
import ChannelAllocation from './ChannelAllocation'

export const ChannelsListItem = ({ localAllocation, remoteAllocation, user,
  status, currency, remotePubKey, sendLightning }) => {
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
    </Box>
  )
}

export default ChannelsListItem
