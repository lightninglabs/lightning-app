import _ from 'lodash'

export const LOG = 'LND/LOG'
export const LOGS = 'LND/LOGS'

export default function lnd(state = { logs: [] }, action) {
  switch (action.type) {
    case LOGS:
      return { logs: [...state.logs, ...action.logs] }
    case LOG:
      return { logs: [...state.logs, action.log] }
    default: return state
  }
}

export const actions = {
  log: (event, log) => ({ type: LOG, log }),
  logs: (event, logs) => ({ type: LOGS, logs }),
}

export const selectors = {
  getRecentLogs: state => _.takeRight(state.logs, 500),
}
