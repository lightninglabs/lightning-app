import React from 'react'
import reactCSS from 'reactcss'

import { Box, Icon, Media, Text } from '../'

export const SidebarItem = ({ color, hoverColor, hover, active, ellipsis,
  onClick, icon, label, display }) => {
  const styles = reactCSS({
    'default': {
      item: {
        padding: 'small',
        color,
        transition: '100ms color ease-out',
        fontSize: 'medium',
      },
      media: {
        paddingLeft: 'small',
        verticalAlign: 'center',
      },
    },
    'hover': {
      item: {
        color: hoverColor,
      },
    },
    'active': {
      item: {
        color: 'teal',
      },
    },
    'ellipsis': {
      label: {
        width: '100%',
      },
      text: {
        block: true,
      },
    },
  }, { hover, active, ellipsis })

  return (
    <Box style={ styles.item } onClick={ onClick }>
      <Media style={ styles.media } left={ <Icon small name={ icon } /> }>
        <Text ellipsis display={ display }>{ label }</Text>
      </Media>
    </Box>
  )
}

export default SidebarItem
