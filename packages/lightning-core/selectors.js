import { scopeStateToSelectors } from 'redux-selector'

import { selectors as accounts } from './accounts'
import { selectors as pay } from './pay'
import { selectors as request } from './request'
import { selectors as transactions } from './transactions'

export const selectors = scopeStateToSelectors({
  accounts,
  pay,
  request,
  transactions,
})
