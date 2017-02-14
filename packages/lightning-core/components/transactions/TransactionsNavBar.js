import React from 'react'
import reactCSS from 'reactcss'

import { Box, Tabs, colors } from 'lightning-components'

export const TranscationNavBar = ({ selected, onTabChange }) => {
  const styles = reactCSS({
    'default': {
      bar: {
        background: 'blue',
        direction: 'row',
        spread: true,
        flexShrink: 0,
      },
      tabs: {
        color: colors.white,
        inactive: colors.black,
      },
      search: {
        color: colors.black,
        opacity: 0.47,
        paddingRight: 'medium',
        display: 'flex',
        verticalAlign: 'center',
      },
    },
    'selected-search': {
      search: {
        color: colors.white,
        opacity: 0.87,
      },
    },
  }, { 'selected-search': selected === 'search' })

  const tabs = [
    {
      label: 'Recent',
      value: 'recent',
      href: '/transactions/recent',
    },
    {
      label: 'In Progress',
      value: 'in-progress',
      href: '/transactions/in-progress',
    },
    {
      label: 'Complete',
      value: 'complete',
      href: '/transactions/complete',
    },
  ]

  return (
    <Box style={ styles.bar }>
      <Tabs
        { ...styles.tabs }
        tabs={ tabs }
        selected={ selected }
        onChange={ onTabChange }
      />
      { /* <Box style={ styles.search }>
        <Icon name="magnify" onClick={ onTabChange && onTabChange.bind(null, 'search') } />
      </Box> */ }
    </Box>
  )
}

export default TranscationNavBar
