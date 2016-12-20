import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import channels from 'lightning-core/reducers/channels'
import lnd from 'lightning-core/reducers/lnd'
import payment from 'lightning-core/reducers/payment'
import transactions from 'lightning-core/reducers/transactions'
import ui from 'lightning-core/reducers/ui'
import wallets from 'lightning-core/reducers/wallets'

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
