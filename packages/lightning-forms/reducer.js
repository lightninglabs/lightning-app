
export const INIT_FORM = 'LIGHTNING_FORMS/INIT_FORM'

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case INIT_FORM:
      return { ...state, [action.form.name]: action.form.data }
    default: return state
  }
}

export const actions = {
  initForm: (name, data) => ({ type: INIT_FORM, form: { name, data } }),
}

export const selectors = {

}
