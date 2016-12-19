import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import channels from 'lightning-core/src/reducers/channels'
import lnd from 'lightning-core/src/reducers/lnd'
import payment from 'lightning-core/src/reducers/payment'
import transactions from 'lightning-core/src/reducers/transactions'
import ui from 'lightning-core/src/reducers/ui'
import wallets from 'lightning-core/src/reducers/wallets'

import notifications from 'lightning-notifications'

export default combineReducers({
  channels,
  lnd,
  payment,
  transactions,
  ui,
  wallets,

  notifications,
  routing,
})
