import React from 'react'
import reactCSS, { hover } from 'reactcss'
import _ from 'lodash'
import { colors, css, fonts } from '../helpers'

export const Media = (props) => {
  const styles = reactCSS({
    'default': {
      select: {
        background: 'transparent',
        border: 'none',
        height: 30,
        boxShadow: 'inset 0 0 0 1px #ccc',
        borderRadius: 2,
        textTransform: 'uppercase',
        color: '#aaa',
        cursor: 'pointer',
        outline: 'none',
        fontSize: fonts.sizes.medium,

        transition: 'box-shadow 200ms ease-out, color 200ms ease-out',
      },
    },
    'hover': {
      select: {
        boxShadow: 'inset 0 0 0 1px #888',
        color: '#777',
      },
    },
    ...css.build('media', 'color', colors),
  }, props)

  return (
    <select style={ styles.select } value={ props.value } onChange={ props.onChange }>
      { _.map(props.options, (option) => {
        return <option key={ option.value } value={ option.value }>{ option.label }</option>
      }) }
    </select>
  )
}

export default hover(Media)
