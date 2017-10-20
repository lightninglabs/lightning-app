/* eslint-disable no-console */

import _ from 'lodash'
import { remote } from 'electron'

const defaults = {
  global: {
    connection: 'connection',
    serverReady: 'serverReady',
  },
  selector: 'default',
}

export const GRPC = 'GRPC/API'
export const SERVER_STARTING = 'GRPC/SERVER_STARTING'
export const SERVER_RUNNING = 'GRPC/SERVER_RUNNING'

export default (opts = {}) => {
  const options = { ...defaults, ...opts }
  const serverReady = remote.getGlobal(options.global.serverReady)

  let client
  let ready = false
  let serverStartingActionSent = false
  let serverRunningActionSent = false

  serverReady && serverReady(() => (ready = true))

  try {
    client = remote.getGlobal(options.global.connection)
  } catch (err) {
    console.log('Error Connecting to GRPC Server', err)
  }

  return () => next => (action) => {
    if (!serverStartingActionSent) {
      serverStartingActionSent = true
      next({ type: SERVER_STARTING })
    }

    if (ready && !serverRunningActionSent) {
      serverRunningActionSent = true
      next({ type: SERVER_RUNNING })
    }

    const call = action && action[GRPC]
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

    if (!ready) {
      return new Promise((resolve, reject) =>
        reject('GRPC Call Deferred, Server Still Starting'))
    }

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

    const now = new Date()
    const deadline = now.setSeconds(now.getSeconds() + 30)

    return new Promise((resolve, reject) => {
      try {
        client[method] && client[method](body, { deadline }, (error, res) => {
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
    })
  }
}
