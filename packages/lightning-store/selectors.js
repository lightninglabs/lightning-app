import { scopeStateToSelectors } from 'redux-selector'

import { selectors as channels } from 'lightning-core/reducers/channels'
import { selectors as lnd } from 'lightning-core/reducers/lnd'
import { selectors as payment } from 'lightning-core/reducers/payment'
import { selectors as ui } from 'lightning-core/reducers/ui'
import { selectors as wallets } from 'lightning-core/reducers/wallets'
import { selectors as notifications } from 'lightning-notifications'

import { selectors as core } from 'lightning-core'
import { selectors as forms } from 'lightning-forms'
import { selectors as popup } from 'lightning-popup'

export default scopeStateToSelectors({
  wallets,
  ui,
  payment,
  lnd,
  channels,
  notifications,

  core,
  forms,
  popup,
})
