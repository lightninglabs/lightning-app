import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import 'normalize.css'
import { configureStore, history } from 'lightning-store'
import { App } from 'lightning-app'
import { remote } from 'electron'

// Release the callbacks on app startup
remote.getCurrentWindow().removeAllListeners()

const store = configureStore()

render(
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <App dispatch={ store.dispatch } />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
)
