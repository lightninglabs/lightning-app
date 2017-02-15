import React from 'react'
import reactCSS from 'reactcss'

import { Route } from 'react-router-dom'
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
          <Sidebar />
        </Box>
        <Box style={ styles.content }>
          <Route path="/pay" component={ PayPage } />
          <Route path="/request" component={ RequestPage } />
          <Route path="/accounts" component={ AccountsPage } />
          <Route path="/transactions" component={ TransactionsPage } />
        </Box>
        <Notifications />
      </Box>
    )
  }
}

export default App
