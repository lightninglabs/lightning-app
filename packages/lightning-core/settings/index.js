import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { store } from 'lightning-store'

import { Box, Text } from 'lightning-components'
import Infinite from 'react-infinite'

export const SettingsPage = ({ logs, pubkey }) => {
  const styles = reactCSS({
    'default': {
      page: {
        boxSizing: 'border-box',
        padding: 'large',
        direction: 'column',
        minWidth: 0,
        flex: 1,
      },
      title: {
        size: 'medium',
        paddingBottom: 'medium',
        color: 'gray',
      },
      account: {
        paddingBottom: 'large',
      },
      logs: {
        flex: 1,
        zDepth: 1,
        width: '100%',
        boxSizing: 'border-box',
        background: 'white',
        marginBottom: 'medium',
      },
      log: {
        size: 'small',
        color: 'gray',
        fontFamily: 'monospace',
      },
    },
  })

  return (
    <Box style={ styles.page }>
      { pubkey ? (
        <Box style={ styles.account }>
          <Text size="medium" display="block" ellipsis><Text bold>Pubkey: </Text>{ pubkey }</Text>
        </Box>
      ) : null }

      <Text { ...styles.title }>Logs</Text>
      <Box style={ styles.logs }>
        <Infinite
          containerHeight={ 400 }
          elementHeight={ 15 }
          styles={{
            scrollableStyle: {
              padding: 15,
              overflowX: 'scroll',
            },
          }}
          displayBottomUpwards
        >
          { _.map(logs, (log, i) => {
            return (
              <div key={ i } style={{ whiteSpace: 'nowrap' }}>
                <Text { ...styles.log }>{ log }</Text>
              </div>
            )
          }) }
        </Infinite>
      </Box>
    </Box>
  )
}

export default connect(
  state => ({
    logs: store.getRecentLogs(state),
    pubkey: store.getAccountPubkey(state),
  })
)(SettingsPage)

export { default as reducer, actions, selectors } from './reducer'
