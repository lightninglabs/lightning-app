import React from 'react'
import reactCSS from 'reactcss'
import { fonts } from '../helpers'

import Box from '../Box'

export const Text = ({ size, onClick, children, uppercase, ellipsis, style,
  color, padding, paddingTop, paddingRight, paddingBottom, paddingLeft, display,
  fontFamily, weight, bold }) => {
  const styles = reactCSS({
    'default': {
      text: {
        fontFamily: (style && style.fontFamily) || fontFamily || fonts.roboto,
        fontSize: (style && style.size) || size,
        color: (style && style.color) || color,
        padding: (style && style.padding) || padding,
        paddingTop: (style && style.paddingTop) || paddingTop,
        paddingRight: (style && style.paddingRight) || paddingRight,
        paddingBottom: (style && style.paddingBottom) || paddingBottom,
        paddingLeft: (style && style.paddingLeft) || paddingLeft,
        display: (style && style.display) || display,
        weight: (style && style.weight) || weight,
      },
    },
    'overwrite': {
      text: style,
    },
    'bold': {
      text: {
        fontWeight: 'bold',
        WebkitFontSmoothing: 'antialiased',
      },
    },
    'uppercase': {
      text: {
        textTransform: 'uppercase',
      },
    },
    'ellipsis': {
      text: {
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    'block': {
      text: {
        display: 'block',
      },
    },
  }, { ellipsis, uppercase, bold }, 'overwrite')

  return (
    <Box style={ styles.text } onClick={ onClick } tag="span">
      { children }
    </Box>
  )
}

export default Text
