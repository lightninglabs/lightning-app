import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import 'normalize.css'
import { configureStore, history } from 'lightning-store'
import { App } from 'lightning-app'
import { remote } from 'electron'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Release the callbacks on app startup
remote.getCurrentWindow().removeAllListeners()

const store = configureStore()

render(
  <Provider store={ store }>
    <MuiThemeProvider>
      <ConnectedRouter history={ history }>
        <App dispatch={ store.dispatch } />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
)
