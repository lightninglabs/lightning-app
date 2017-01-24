import React from 'react'
import reactCSS from 'reactcss'
import { fonts, spacing, colors } from '../helpers'

export const Input = ({ style, large, onEnter, onKeyDown, value, placeholder,
  type, onChange, fontSize, color, readOnly, onFocus, onBlur }) => {
  const styles = reactCSS({
    'default': {
      input: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        height: 54,
        padding: 0,
        paddingRight: spacing.medium,
        paddingLeft: spacing.medium,
        fontSize: fontSize ? fonts.sizes[fontSize] : fonts.sizes.medium,
        color: color ? colors[color] : colors.black,
        boxSizing: 'border-box',
        ...style,
      },
    },
    'large': {
      input: {
        height: 74,
        padding: 0,
        paddingRight: spacing.medium + 5,
        paddingLeft: spacing.medium + 5,
        fontSize: fonts.sizes.xl,
      },
    },
  }, { large })

  const handleKeyDown = (e) => {
    const ENTER = 13
    if (e.keyCode === ENTER) {
      onEnter && onEnter(e)
    }
    onKeyDown && onKeyDown(e)
  }

  return (
    <input
      style={ styles.input }
      value={ value }
      placeholder={ placeholder }
      type={ type }
      onKeyDown={ handleKeyDown }
      onChange={ onChange }
      readOnly={ readOnly }
      onFocus={ onFocus }
      onBlur={ onBlur }
    />
  )
}

export default Input
