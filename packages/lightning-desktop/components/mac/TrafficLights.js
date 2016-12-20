import React from 'react'
import reactCSS, { hover as h } from 'reactcss'
import { remote } from 'electron'

import { Box } from 'lightning-components'

export const TrafficLights = ({ hover }) => {
  const styles = reactCSS({
    'default': {
      traffic: {
        direction: 'row',
      },
      light: {
        width: '12px',
        height: '12px',
        marginRight: '7px', // hacky
        borderRadius: '50%',
        background: 'gray',
        cursor: 'pointer',
      },
    },
    'hover': {
      light: {
        background: 'off-white',
      },
    },
  }, { hover })

  const electron = remote.getCurrentWindow()
  const handleClose = () => electron.close()
  const handleMin = () => electron.minimize()
  const handleMax = () => (
    electron.isFullScreen() ? electron.setFullScreen(false) : electron.setFullScreen(true)
  )

  return (
    <Box style={ styles.traffic }>
      <Box style={ styles.light } onClick={ handleClose } />
      <Box style={ styles.light } onClick={ handleMin } />
      <Box style={ styles.light } onClick={ handleMax } />
    </Box>
  )
}

export default h(TrafficLights)
