import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import { reducer as core } from 'lightning-core'
import { reducer as forms } from 'lightning-forms'
import notifications from 'lightning-notifications'
import { reducer as popup } from 'lightning-popup'

export default combineReducers({
  routing,

  core,
  forms,
  notifications,
  popup,
})
