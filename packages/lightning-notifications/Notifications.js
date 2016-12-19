import React from 'react'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { store } from 'lightning-store'

import { Box } from 'lightning-components'

export const Notifications = ({ message }) => {
  const styles = reactCSS({
    'default': {
      notification: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        padding: 'medium',
        fontSize: 'medium',
        minWidth: 288,
        minHeight: 17,
        borderRadius: 2,
        background: 'black',
        color: 'white',
        zDepth: 1,
        opacity: 0,
        transform: 'translateY(60px)',
        transition: 'all 100ms ease-out',
      },
    },
    'visible': {
      notification: {
        transform: 'translateY(0)',
        opacity: 0.97,
      },
    },
  }, { visible: !!message })
  return (
    <Box style={ styles.notification }>
      { message }
    </Box>
  )
}

export default connect(
  state => ({
    ...store.getRecentNotification(state),
  }),
)(Notifications)
