import { applyMiddleware } from 'redux'
import { hashHistory } from 'react-router-dom'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createIpc from 'redux-electron-ipc'
import createGrpc from 'redux-grpc-middleware'
import { actions as logActions } from 'lightning-core/reducers/lnd'

const path = process.env.NODE_ENV === 'development' ? '../lightning-desktop/lnd' : './lnd'
const ipc = createIpc(logActions)
const grpc = createGrpc({ path })
const logger = createLogger({ level: 'info', collapsed: true })

const router = routerMiddleware(hashHistory)

export default applyMiddleware(
  grpc,
  router,
  thunk,
  ipc,
  logger,
)
