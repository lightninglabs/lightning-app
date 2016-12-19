import React from 'react'

import { Box } from 'lightning-components'
import ChannelAllocationBar from './ChannelAllocationBar'

export const ChannelAllocation = ({ left, right, status }) => {
  const total = left + right

  return (
    <Box flex={ 1 } direction="row" verticalAlign="stretch">
      <ChannelAllocationBar
        percentage={ (left / total) * 100 }
        align="left"
        status={ status }
      />
      <ChannelAllocationBar
        percentage={ (right / total) * 100 }
        align="right"
        status={ status }
      />
    </Box>
  )
}

export default ChannelAllocation
