import React from 'react'

import { Text } from 'lightning-components'

export const Identity = ({ name, user, maxWidth }) => {
  return (
    <Text bold ellipsis style={{ maxWidth, width: 'auto', display: 'block' }}>
      { name === user ? 'You' : name }
    </Text>
  )
}

export default Identity
