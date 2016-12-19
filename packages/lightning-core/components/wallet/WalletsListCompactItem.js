import React from 'react'
import reactCSS, { hover as h } from 'reactcss'

import { Box, Icon, Media, Text } from 'lightning-components'
import { Money } from '../common'

import { total } from '../../helpers/wallet'

export const WalletsListCompactItem = ({ active, onSelect, hover, amount, id,
  identity, currency }) => {
  const styles = reactCSS({
    'default': {
      item: {
        cursor: 'pointer',
        display: 'block',
        marginBottom: 1,
        zDepth: 1,
        padding: 'medium',
      },

      radio: {
        name: 'radiobox-blank',
        color: 'light-gray',
      },
    },
    'active': {
      wrap: {
        block: true,
      },
      switch: {
        display: 'none',
      },

      radio: {
        name: 'radiobox-marked',
        color: 'teal',
      },
    },
    'active-false': {
      total: {
        'black': false,
        'light-gray': true,
      },
      identity: {
        'light-gray': true,
      },
    },
    'hover': {
      switch: {
        display: 'flex',
      },
    },
  }, { active, hover, 'active-false': active === false })

  const handleClick = () => onSelect(id)

  return (
    <Box style={ styles.item } onClick={ handleClick }>
      <Media
        paddingLeft="medium"
        left={ active ? (
          <Icon style={ styles.radio } />
        ) : (
          <Icon style={ styles.radio } />
        ) }
      >
        <Text size="medium" display="block">{ identity }</Text>
        <Text size="medium" color="black">
          <Money sign amount={ total(amount) } currency={ currency } />
        </Text>
      </Media>
    </Box>
  )
}

WalletsListCompactItem.defaultProps = {
  active: false,
}

export default h(WalletsListCompactItem)
