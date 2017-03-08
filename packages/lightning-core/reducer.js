import { combineReducers } from 'redux'

import { reducer as accounts } from './accounts'
import { reducer as pay } from './pay'
import { reducer as request } from './request'
import { reducer as transactions } from './transactions'

export const reducer = combineReducers({
  accounts,
  pay,
  request,
  transactions,
})

export { selectors } from './selectors'
