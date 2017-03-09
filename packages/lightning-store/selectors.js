import { scopeStateToSelectors } from 'redux-selector'

import { selectors as core } from 'lightning-core'
import { selectors as forms } from 'lightning-forms'
import { selectors as notifications } from 'lightning-notifications'
import { selectors as popup } from 'lightning-popup'

export default scopeStateToSelectors({
  core,
  forms,
  notifications,
  popup,
})
