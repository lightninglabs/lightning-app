import React from 'react'
import reactCSS from 'reactcss'

import { Route, Switch, Redirect } from 'react-router-dom'
import { Box } from 'lightning-components'
import { Notifications } from 'lightning-notifications'
import { Sidebar, PayPage, RequestPage, AccountsPage, CreateChannelPage,
  TransactionsPage, SettingsPage, Streams } from 'lightning-core'

const App = () => {
  const styles = reactCSS({
    'default': {
      app: {
        direction: 'row',
        absolute: '0 0 0 0',
        fontFamily: '"Roboto", "Helvetica", sans-serif',
        overflow: 'hidden',
      },
      lights: {
        paddingTop: 'medium',
        paddingLeft: 'medium',
      },
      sidebar: {
        direction: 'column',
        userSelect: 'none',
        cursor: 'default',
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

export default App
