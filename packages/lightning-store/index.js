/* eslint-disable import/no-named-as-default-member */

import { createStore } from 'redux'
import storage from './local-storage'
import middleware from './middleware'
import reducers from './reducers'

const state = { ...storage.load(), transactions: [] }

export function configureStore(initialState = state) {
  const store = createStore(reducers, initialState, middleware)
  storage.save(store)

  return store
}

export { default as store } from './selectors'
