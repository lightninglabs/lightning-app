import electron from 'electron'

const defaults = {
  path: './main.development.js',
  selector: 'default',
}

export const GRPC = 'GRPC/API'

export default (opts = {}) => {
  const options = { ...defaults, ...opts }
  const client = electron.remote.require(options.path)[options.selector]

  return () => next => (action) => {
    const call = action && action[GRPC]
    if (typeof call === 'undefined' || !call) { return next(action) }

    const { method, types = [], body, model, passthrough = {}, stream = false } = call
    const [REQUEST, SUCCESS, ERROR] = types

    REQUEST && next({ type: REQUEST })

    if (stream) { return client[method](body ? { body } : {}) }

    return new Promise((resolve, reject) => {
      const api = client[method](body || {}, (error, res) => {
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
