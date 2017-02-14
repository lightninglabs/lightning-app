import React from 'react'
import reactCSS from 'reactcss'

import { Route, Switch, Redirect, Link } from 'react-router-dom'
import { Box } from 'lightning-components'
import { Notifications } from 'lightning-notifications'
import { Sidebar, PayPage, RequestPage, AccountsPage, TransactionsPage } from 'lightning-core'

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
          <Sidebar Link={ Link } />
        </Box>
        <Box style={ styles.content }>
          <Switch>
            <Route pattern="/pay" component={ PayPage } />
            <Route pattern="/request" component={ RequestPage } />
            <Route pattern="/accounts" component={ AccountsPage } />
            <Route pattern="/transactions" component={ TransactionsPage } />
            <Route render={ () => <Redirect to="/pay" /> } />
          </Switch>
        </Box>
        <Notifications />
      </Box>
    )
  }
}

export default App
