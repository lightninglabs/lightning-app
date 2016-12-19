import React from 'react'
import reactCSS from 'reactcss'

import Box from '../Box'

export const Media = ({ left, right, children, paddingLeft,
  paddingRight, align, verticalAlign, style }) => {
  const styles = reactCSS({
    'default': {
      media: {
        direction: 'row',
        align: (style && style.align) || align,
        verticalAlign: (style && style.verticalAlign) || verticalAlign,
      },
      center: {
        flex: 1,
        minWidth: 0,
        paddingLeft: (style && style.paddingLeft) || paddingLeft,
        paddingRight: (style && style.paddingRight) || paddingRight,
      },
    },
  })

  return (
    <Box style={ styles.media }>
      { left }
      <Box style={ styles.center }>{ children }</Box>
      { right }
    </Box>
  )
}

export default Media
