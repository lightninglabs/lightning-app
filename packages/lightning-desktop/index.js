import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router'
import 'normalize.css'
import { configureStore } from 'lightning-store'
import App from './components/App'

const store = configureStore()

render(
  <Provider store={ store }>
    <HashRouter>
      <App dispatch={ store.dispatch } />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
