import React from 'react'
import reactCSS from 'reactcss'

import { Route, Switch, Redirect } from 'react-router-dom'
import { Box } from 'lightning-components'
import { Notifications } from 'lightning-notifications'
import { Sidebar, PayPage, RequestPage, AccountsPage, CreateChannelPage,
  TransactionsPage, SettingsPage, Streams } from 'lightning-core'
import { TrafficLights } from '@components/electron'

// eslint-disable-next-line
export class App extends React.Component {
  render() {
    const styles = reactCSS({
      'default': {
        app: {
          direction: 'row',
          absolute: '0 0 0 0',
          WebkitAppRegion: 'drag',
          fontFamily: '"Roboto", "Helvetica", sans-serif',
          overflow: 'hidden',
        },
        sidebar: {
          direction: 'column',
          width: '170px',
          color: 'white',
        },
        content: {
          background: 'off-white',
          flex: '1',
          overflowY: 'scroll',
          display: 'flex',
        },
      },
    })

    return (
      <Box style={ styles.app }>
        <Box style={ styles.sidebar }>
          <TrafficLights
            background="#666"
            color="#999"
          />
          <Sidebar />
        </Box>
        <Box style={ styles.content }>
          <Switch>
            <Route path="/pay" component={ PayPage } />
            <Route path="/request" component={ RequestPage } />
            <Route path="/accounts" component={ AccountsPage } />
            <Route path="/create-channel" component={ CreateChannelPage } />
            <Route path="/transactions" component={ TransactionsPage } />
            <Route path="/settings" component={ SettingsPage } />
            <Route render={ () => <Redirect to="/pay" /> } />
          </Switch>
        </Box>
        <Notifications />
        <Streams />
      </Box>
    )
  }
}

export default App
