import _ from 'lodash'

export { default as Notifications } from './Notifications'

export const ADD = 'NOTIFICATIONS/ADD'
export const REMOVE = 'NOTIFICATIONS/REMOVE'
export const NOTIFICATION = 'NOTIFICATIONS/NOTIFICATION'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return `${ s4() + s4() }-${ s4() }-${ s4() }-${ s4() }-${ s4() }${ s4() }${ s4() }`
}

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
