import React from 'react'
import reactCSS from 'reactcss'
import _ from 'lodash'

import { Box, Tab } from '../'

export const Tabs = ({ background, tabs, selected, color, inactive, onChange }) => {
  const styles = reactCSS({
    'default': {
      tabs: {
        background,
        direction: 'row',
      },
    },
  })

  return (
    <Box style={ styles.tabs }>
      { _.map(tabs, (tab, i) => {
        return (
          <Tab
            key={ i }
            { ...tab }
            selected={ tab.value === selected }
            color={ color }
            inactive={ inactive }
            onClick={ onChange }
          />
        )
      }) }
    </Box>
  )
}

export default Tabs
