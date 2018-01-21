import { scopeStateToSelectors } from 'redux-selector'

import { selectors as accounts } from './accounts'
import { selectors as pay } from './pay'
import { selectors as request } from './request'
import { selectors as settings } from './settings'
import { selectors as transactions } from './transactions'
import { selectors as fund } from './fund'

export const selectors = scopeStateToSelectors({
  accounts,
  pay,
  request,
  settings,
  transactions,
  fund,
})
