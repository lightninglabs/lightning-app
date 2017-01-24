import React from 'react'
import reactCSS from 'reactcss'
import _ from 'lodash'

import { Box, Text, LiftedInput } from 'lightning-components'

export const Settings = ({ logs, account }) => {
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
        padding: 'medium',
        overflowX: 'auto',
        WebkitAppRegion: 'no-drag',
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

  const handleEnter = (e) => {
    console.log(e.target.value)
    // eslint-disable-next-line no-param-reassign
    e.target.value = ''
  }

  return (
    <Box style={ styles.page }>
      { account.pubKey ? (
        <Box style={ styles.account }>
          <Text size="medium" display="block" ellipsis><Text bold>PubKey: </Text>{ account.pubKey }</Text>
          <br />
          <Text size="medium" display="block" ellipsis><Text bold>Lightning ID: </Text>{ account.lnid }</Text>
        </Box>
      ) : null }

      <Text { ...styles.title }>Logs</Text>
      <Box style={ styles.logs }>
        { _.map(logs, (log, i) => {
          return (
            <div key={ i } style={{ whiteSpace: 'nowrap' }}>
              <Text { ...styles.log }>{ log }</Text>
            </div>
          )
        }) }
      </Box>

      <Box paddingBottom="medium" />

      <LiftedInput
        placeholder="Type Commands Here"
        style={{ width: '100%' }}
        onEnter={ handleEnter }
      />
      {/* <a onClick={ navigateToSplash }>Splash</a> */}
    </Box>
  )
}

export default Settings
