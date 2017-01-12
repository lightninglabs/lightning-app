import React from 'react'

import { Box, colors } from 'lightning-components'

export const Channels = ({ navigateToHome }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: colors['dark-purple'],
    }}
  >
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'url(http://il3.picdn.net/shutterstock/videos/10141553/thumb/1.jpg)',
        backgroundSize: 'cover',
        opacity: '0.4',
      }}
    />
    <Box
      style={{ position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      direction="column"
      align="center"
      verticalAlign="center"
    >
      <Box paddingTop="large" />
      <Box
        background="teal"
        color="white"
        display="flex"
        align="center"
        verticalAlign="center"
        height={ 54 }
        borderRadius={ 2 }
        paddingLeft="medium"
        paddingRight="medium"
        fontSize="large"
        zDepth={ 1 }
        onClick={ navigateToHome }
      >
          Create a New Wallet
        </Box>
      <Box
        color="white"
        display="flex"
        align="center"
        verticalAlign="center"
        height={ 54 }
        borderRadius={ 2 }
        paddingLeft="medium"
        paddingRight="medium"
        fontSize="large"
        paddingTop="small"
        opacity={ 0.67 }
        onClick={ navigateToHome }
      >
          Connect Wallet
        </Box>
    </Box>
  </div>
)
export default Channels
