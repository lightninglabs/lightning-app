import _ from 'lodash'
import { guid } from './helpers'

export { default as Notifications } from './Notifications'

export const ADD = 'NOTIFICATIONS/ADD'
export const REMOVE = 'NOTIFICATIONS/REMOVE'
export const NOTIFICATION = 'NOTIFICATIONS/NOTIFICATION'

export default function notifications(state = [], action) {
  const data = {
    [ADD]: () => {
      return [...state, action.notification]
    },
    [REMOVE]: () => {
      return _.reject(state, { id: action.id })
    },
  }[action.type]
  return (data && data()) || state
}

export const actions = {
  addNotification: message => (dispatch) => {
    const id = guid()
    dispatch({ type: ADD, notification: { message, id } })

    setTimeout(() => {
      dispatch(actions.removeNotification(id))
    }, 2000)
  },
  removeNotification: id => ({ type: REMOVE, id }),
  onSuccess: message => dispatch => dispatch(actions.addNotification(message)),
  onError: message => dispatch => dispatch(actions.addNotification(message)),
}

export const selectors = {
  getRecentNotification: state => state[0],
}
