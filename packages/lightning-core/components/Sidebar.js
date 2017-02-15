import React from 'react'
import reactCSS from 'reactcss'

import { Box, Text } from 'lightning-components'
import NavLinks from './nav/NavLinks'
import NavFooter from './nav/NavFooter'

export const Sidebar = ({ navigateToSubpage, user, currency, account, isSynced }) => {
  const styles = reactCSS({
    'default': {
      sidebar: {
        direction: 'column',
        spread: true,
        flex: 1,
      },
      section: {
        padding: 'small',
      },
      synced: {
        background: 'blue',
        direction: 'column',
        align: 'center',
        verticalAlign: 'center',
        marginLeft: -7,
        marginTop: 7,
        marginRight: -7,
        marginBottom: -7,
        borderBottomLeftRadius: 4,
        height: 34,
      },
      syncedText: {
        color: 'black',
        size: 'small',
      },
    },
  })

  return (
    <Box style={ styles.sidebar }>
      <Box style={ styles.section }>
        <NavLinks onChange={ navigateToSubpage } />
      </Box>
      <Box style={ styles.section }>
        <NavFooter
          { ...user }
          account={ account }
          currency={ currency }
          onClickAccount={ navigateToSubpage }
        />
        { isSynced ? null : (
          <Box style={ styles.synced }>
            <Text style={ styles.syncedText }>Syncing to Chain</Text>
          </Box>
        ) }
      </Box>
    </Box>
  )
}

export default Sidebar
