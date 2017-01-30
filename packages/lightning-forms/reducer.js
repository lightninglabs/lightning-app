import _ from 'lodash'

export const INIT_FORM = 'LIGHTNING_FORMS/INIT_FORM'
export const EDIT_FORM = 'LIGHTNING_FORMS/EDIT_FORM'
export const CLEAR_FORM = 'LIGHTNING_FORMS/CLEAR_FORM'

const formReducer = (state = {}, action) => {
  switch (action.type) {
    case INIT_FORM:
    case EDIT_FORM:
      return { ...state, ...action.form.data }
    case CLEAR_FORM:
      return _.mapValues(state, '')
    default: return state
  }
}

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case INIT_FORM:
    case EDIT_FORM:
    case CLEAR_FORM:
      return { ...state, [action.form.name]: formReducer(state[action.form.name], action) }
    default: return state
  }
}

export const actions = {
  initForm: (name, data) => ({ type: INIT_FORM, form: { name, data } }),
  editForm: (name, data) => ({ type: EDIT_FORM, form: { name, data } }),
  clearForm: name => ({ type: CLEAR_FORM, form: { name } }),
}

export const selectors = {
  getForm: (state, name) => state[name] || {},
}
