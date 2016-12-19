import { scopeStateToSelectors } from 'redux-selector'

import { selectors as channels } from 'lightning-core/src/reducers/channels'
import { selectors as lnd } from 'lightning-core/src/reducers/lnd'
import { selectors as payment } from 'lightning-core/src/reducers/payment'
import { selectors as transactions } from 'lightning-core/src/reducers/transactions'
import { selectors as ui } from 'lightning-core/src/reducers/ui'
import { selectors as wallets } from 'lightning-core/src/reducers/wallets'
import { selectors as notifications } from 'lightning-notifications'

export default {
  ...scopeStateToSelectors({
    wallets,
    ui,
    payment,
    transactions,
    lnd,
    channels,
    notifications,
  }),
}
