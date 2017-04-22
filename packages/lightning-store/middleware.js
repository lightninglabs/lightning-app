import { applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createIpc from 'redux-electron-ipc'
import createGrpc from 'redux-grpc-middleware'
import { actions as logActions } from 'lightning-core/settings'

import { createHashHistory } from 'history'

const ipc = createIpc(logActions)
const grpc = createGrpc()
const logger = createLogger({ level: 'info', collapsed: true })

export const history = createHashHistory()
const router = routerMiddleware(history)

export default applyMiddleware(
  grpc,
  router,
  thunk,
  ipc,
  logger,
)
