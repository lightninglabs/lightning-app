import { scopeStateToSelectors } from 'redux-selector'

import { selectors as channels } from 'lightning-core/reducers/channels'
import { selectors as lnd } from 'lightning-core/reducers/lnd'
import { selectors as payment } from 'lightning-core/reducers/payment'
import { selectors as transactions } from 'lightning-core/reducers/transactions'
import { selectors as ui } from 'lightning-core/reducers/ui'
import { selectors as wallets } from 'lightning-core/reducers/wallets'
import { selectors as notifications } from 'lightning-notifications'

import { selectors as forms } from 'lightning-forms'

export default scopeStateToSelectors({
  wallets,
  ui,
  payment,
  transactions,
  lnd,
  channels,
  notifications,
  forms,
})
