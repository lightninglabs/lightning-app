import React from 'react'
import reactCSS, { hover as h } from 'reactcss'

import { Link } from 'react-router-dom'

import { Box, Text } from '../'

export const Tab = ({ inactive, color, href, children, label, hover }) => {
  const styles = reactCSS({
    'default': {
      tab: {
        color: inactive || color,
        cursor: 'pointer',
        height: 48,
        fontWeight: '500',
        whiteSpace: 'nowrap',
        opacity: 0.47,
        transition: 'opacity 100ms linear',
        minWidth: 68,
        maxWidth: 240,
        textAlign: 'center',
        textDecoration: 'none',
        display: 'flex',
      },
      activeTab: {
        color,
        opacity: 0.87,
        boxShadow: `inset 0 -3px 0 ${ color }`,
      },
    },
    'hover': {
      tab: {
        opacity: 0.67,
      },
    },
  }, { hover })

  return (
    <Link
      to={ href }
      style={ styles.tab }
      activeStyle={ Object.assign({}, styles.tab, styles.activeTab) }
    >
      <Box paddingLeft="medium" paddingRight="medium" direction="column" verticalAlign="center">
        <Text size="medium" uppercase>{ children || label }</Text>
      </Box>
    </Link>
  )
}

export default h(Tab)
