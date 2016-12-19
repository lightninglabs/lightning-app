import React from 'react'
import reactCSS from 'reactcss'

import { Box, Text } from 'lightning-components'

export const Header = ({ background, color, center, title, right }) => {
  const styles = reactCSS({
    'default': {
      header: {
        background,
        color,
        direction: 'row',
        spread: true,
        padding: 'large',
        paddingBottom: 'small',
        paddingTop: 'xl',
        flexShrink: 0,
      },
    },
    'center': {
    },
  }, { center })

  return (

    <Box style={ styles.header }>
      <Text size="xl" this>{ title }</Text>
      { right }
    </Box>
  )
}

Header.defaultProps = {
  color: 'light-gray',
}

export default Header
