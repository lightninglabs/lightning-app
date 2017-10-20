export const OPEN_POPUP = 'LIGHTNING_POPUP/OPEN_POPUP'
export const CLOSE_POPUP = 'LIGHTNING_POPUP/CLOSE_POPUP'

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case OPEN_POPUP:
      return { ...state, [action.name]: true }
    case CLOSE_POPUP:
      return { ...state, [action.name]: false }
    default: return state
  }
}

export const actions = {
  onClose: name => ({ type: CLOSE_POPUP, name }),
  onOpen: name => ({ type: OPEN_POPUP, name }),
}

export const selectors = {
  getPopupVisibility: (state, name) => state[name] || false,
}
