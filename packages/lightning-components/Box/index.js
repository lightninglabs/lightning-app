import React from 'react'
import reactCSS from 'reactcss'
import _ from 'lodash'
import { colors, css, fonts, spacing } from '../helpers'

// can look for close values. if padding="3px" it would suggest you to use 'xs'

const keys = ['display', 'direction', 'color', 'background', 'padding', 'paddingTop',
  'paddingRight', 'paddingBottom', 'paddingLeft', 'fontSize', 'align',
  'verticalAlign', 'spread', 'zDepth']

export const Box = (props) => {
  const styles = reactCSS({
    'default': {
      box: {
        flex: (props.style && props.style.flex) || props.flex,
        height: (props.style && props.style.height) || props.height,
        width: (props.style && props.style.width) || props.width,
        opacity: (props.style && props.style.opacity) || props.opacity,
        borderRadius: (props.style && props.style.borderRadius) || props.borderRadius,
        transition: 'box-shadow 100ms ease-out',
      },
    },

    ...css.splat('display', {
      'inline': 'inline',
      'block': 'block',
      'flex': 'flex',
      'inline-block': 'inline-block',
      'none': 'none',
    }, 'box'),

    ...css.splat('direction', {
      row: {
        display: 'flex',
        flexDirection: 'row',
      },
      column: {
        display: 'flex',
        flexDirection: 'column',
      },
    }, 'box'),

    ...css.splat('color', colors, 'box'),
    ...css.splat('background', colors, 'box'),

    ...css.splat('padding', spacing, 'box'),
    ...css.splat('paddingTop', spacing, 'box'),
    ...css.splat('paddingLeft', spacing, 'box'),
    ...css.splat('paddingBottom', spacing, 'box'),
    ...css.splat('paddingRight', spacing, 'box'),

    ...css.splat('fontSize', fonts.sizes, 'box'),

    ...css.splat('align', {
      left: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      right: {
        justifyContent: 'flex-end',
      },
    }, 'box', props.direction === 'row' || (props.style && props.style.direction === 'row')),

    ...css.splat('verticalAlign', {
      top: {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
      bottom: {
        alignItems: 'flex-end',
      },
      stretch: {
        alignItems: 'stretch',
      },
    }, 'box', props.direction === 'row' || (props.style && props.style.direction === 'row')),

    ...css.splat('align', {
      left: {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
      right: {
        alignItems: 'flex-end',
      },
      stretch: {
        alignItems: 'stretch',
      },
    }, 'box', props.direction === 'column' || (props.style && props.style.direction === 'column')),

    ...css.splat('verticalAlign', {
      top: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      bottom: {
        justifyContent: 'flex-end',
      },
    }, 'box', props.direction === 'column' || (props.style && props.style.direction === 'column')),

    'zDepth-0': {
      box: {
        boxShadow: 'none',
      },
    },
    'zDepth-1': {
      box: {
        boxShadow: '0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16)',
      },
    },
    'zDepth-11': {
      box: {
        boxShadow: '0 4px 20px rgba(0,0,0,.22), 0 2px 5px rgba(0,0,0,.26)',
      },
    },

    'spread': {
      box: {
        justifyContent: 'space-between',
      },
    },
    'clickable': {
      box: {
        cursor: 'pointer',
      },
    },

    'custom': {
      box: _.omit(props.style, [...keys, 'children']),
    },
  }, props, _.pick(props.style, keys), { clickable: props.onClick !== undefined }, 'custom')

  const Tag = props.tag || 'div'

  return (
    <Tag style={ styles.box } onClick={ props.onClick } className={ props.className }>
      { props.children }
    </Tag>
  )
}

export default Box
