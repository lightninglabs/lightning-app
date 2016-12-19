import _ from 'lodash'

export default {
  build: (element, property, obj) => {
    return _.mapValues(obj, (value) => {
      return { [element]: { [property]: value } }
    })
  },

  splat: (prop, options, element, shouldReturn = true, propOverride) => {
    return shouldReturn ? _.merge(..._.map(options, (optionValue, optionKey) => {
      return { [`${ propOverride || prop }-${ optionKey }`]: {
        [element]: _.isPlainObject(optionValue) ? optionValue : {
          [prop]: optionValue,
        },
      } }
    })) : {}
  },
}
