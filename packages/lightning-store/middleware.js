import { applyMiddleware } from 'redux'
import { hashHistory } from 'react-router-dom'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createIpc from 'redux-electron-ipc'
import createGrpc from 'redux-grpc-middleware'
import { actions as logActions } from 'lightning-core/settings'

const ipc = createIpc(logActions)
const grpc = createGrpc({ global: 'lndConn' })
const logger = createLogger({ level: 'info', collapsed: true })

const router = routerMiddleware(hashHistory)

export default applyMiddleware(
  grpc,
  router,
  thunk,
  ipc,
  logger,
)
