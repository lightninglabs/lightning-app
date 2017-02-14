/* eslint-disable no-console */

import { remote } from 'electron'

const defaults = {
  path: '',
  selector: 'default',
}

export const GRPC = 'GRPC/API'

export default (opts = {}) => {
  const options = { ...defaults, ...opts }
  const client = remote.require(options.path)[options.selector]

  return () => next => (action) => {
    const call = action && action[GRPC] // eslint-disable-line
    if (typeof call === 'undefined' || !call) { return next(action) }

    const { method, types = [], body, model, passthrough = {}, stream = false } = call
    const [REQUEST, SUCCESS, ERROR] = types

    REQUEST && next({ type: REQUEST })

    if (stream) { return client[method] ? client[method](body ? { body } : {}) : { on: () => {} } }

    return new Promise((resolve, reject) => {
      const api = client[method] && client[method](body || {}, (error, res) => {
        if (error) {
          ERROR && next({ type: ERROR, error })
          reject({ ...error, stream: api })
        } else {
          const data = { [model || method]: res }
          SUCCESS && next({ type: SUCCESS, ...data, ...passthrough })
          resolve({ ...data, stream: api, ...passthrough })
        }
      })
    })
  }
}
