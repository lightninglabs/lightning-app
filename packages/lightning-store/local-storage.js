import _ from 'lodash'

const STATE = 'LIGHTNING_STATE'

export const save = (store) => {
  // const saveState = _.debounce(() => {
  //   localStorage.setItem(STATE, JSON.stringify(store.getState()))
  // }, 5000)

  // store.subscribe(saveState)
}

export const load = () => {
  return JSON.parse(localStorage.getItem(STATE)) || {}
}

export default exports
