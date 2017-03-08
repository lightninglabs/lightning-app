import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import channels from 'lightning-core/reducers/channels'
import lnd from 'lightning-core/reducers/lnd'
import payment from 'lightning-core/reducers/payment'
import ui from 'lightning-core/reducers/ui'
import wallets from 'lightning-core/reducers/wallets'

import { reducer as core } from 'lightning-core'
import { reducer as forms } from 'lightning-forms'
import notifications from 'lightning-notifications'
import { reducer as popup } from 'lightning-popup'

export default combineReducers({
  routing,

  channels,
  lnd,
  payment,
  ui,
  wallets,

  core,
  forms,
  notifications,
  popup,
})
