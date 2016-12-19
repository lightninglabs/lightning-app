import React from 'react'

import Box from '../Box'
import Text from '../Text'
import Media from '../Media'
import Icon from '../Icon'

export const LinkWithIcon = ({ onClick, label, icon, paddingBottom, color }) => {
  return (
    <Box
      direction="row"
      align="center"
      verticalAlign="center"
    >
      <Text
        size="large"
        color={ color }
        padding="large"
        paddingBottom={ paddingBottom }
        onClick={ onClick }
      >
        <Media
          paddingRight="small"
          right={ <Icon name={ icon } /> }
        >
          { label }
        </Media>
      </Text>
    </Box>
  )
}

LinkWithIcon.defaultProps = {
  color: 'teal',
}

export default LinkWithIcon
