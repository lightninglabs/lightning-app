import React from 'react'
import reactCSS from 'reactcss'
import { colors, css, icons } from '../helpers'

export const Icon = (props) => {
  const styles = reactCSS({
    'default': {
      icon: {
        width: 24,
        height: 24,
      },
    },
    'small': {
      icon: {
        width: 20,
        height: 20,
      },
    },
    'large': {
      icon: {
        width: 48,
        height: 48,
      },
    },
    'clickable': {
      icon: {
        cursor: 'pointer',
      },
    },
    ...css.build('icon', 'color', _.mapKeys(colors, (v, k) => (`color-${ k }`))),
  }, props, props.style, {
    'clickable': !!props.onClick,
    'large': props.size === 'large',
  })

  return (
    <svg viewBox="0 0 24 24" style={ styles.icon } onClick={ props.onClick }>
      { icons.find(props.name || (props.style && props.style.name)) }
    </svg>
  )
}

export default Icon
