import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import 'normalize.css'
import { configureStore } from 'lightning-store'
import { App } from 'lightning-app'
import { remote } from 'electron'

// Release the callbacks on app startup
remote.getCurrentWindow().removeAllListeners()

const store = configureStore()

render(
  <Provider store={ store }>
    <HashRouter>
      <App dispatch={ store.dispatch } />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
