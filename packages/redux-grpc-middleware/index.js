/* eslint-disable no-console */
import _ from 'lodash'
import { remote } from 'electron'

const defaults = {
  global: '',
  selector: 'default',
}

export const GRPC = 'GRPC/API'

export default (opts = {}) => {
  const options = { ...defaults, ...opts }
  let client

  try {
    client = remote.getGlobal(options.global)
  } catch (err) {
    console.log('Error Connecting to GRPC Server', err)
  }

  return () => next => (action) => {
    const call = action && action[GRPC] // eslint-disable-line
    if (typeof call === 'undefined' || !call) { return next(action) }

    const { method, body } = call
    const {
      params = {},
      types = [],
      passthrough = {},
      schema = data => data,
      stream = false,
    } = call
    const [REQUEST, SUCCESS, ERROR] = _.isArray(types) ? types : [null, types]

    REQUEST && next({ type: REQUEST })

    if (stream) {
      if (client[method]) {
        let streamCall
        try {
          streamCall = client[method](body ? { body } : params)
        } catch (err) {
          console.log('Error From Stream Method', method, err)
        } finally {
          // eslint-disable-next-line
          return streamCall
        }
      }
      return { on: () => {} }
    }

    return new Promise((resolve, reject) => {
      try {
        client[method] && client[method](body, (error, res) => {
          if (error) {
            ERROR && next({ type: ERROR, error })
            reject({ ...error })
          } else {
            SUCCESS && next({ type: SUCCESS, ...schema(res), ...passthrough, noSchema: res })
            resolve({ ...schema(res), ...passthrough, noSchema: res })
          }
        })
      } catch (err) {
        console.log('Error From Method', method, err)
        reject('Error From Method', method, err)
      }
    }).catch(console.error)
  }
}
