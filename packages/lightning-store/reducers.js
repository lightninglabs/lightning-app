import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import channels from 'lightning-core/reducers/channels'
import lnd from 'lightning-core/reducers/lnd'
import payment from 'lightning-core/reducers/payment'
import ui from 'lightning-core/reducers/ui'
import wallets from 'lightning-core/reducers/wallets'

import { reducer as accounts } from 'lightning-core/accounts'
import { reducer as request } from 'lightning-core/request'
import { reducer as transactions } from 'lightning-core/transactions'

import { reducer as forms } from 'lightning-forms'
import { reducer as popup } from 'lightning-popup'
import notifications from 'lightning-notifications'

export default combineReducers({
  channels,
  lnd,
  payment,
  ui,
  wallets,

  accounts,
  request,
  transactions,

  notifications,
  forms,
  popup,
  routing,
})
