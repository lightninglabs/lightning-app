import _ from 'lodash'

export const addCommas = (number) => {
  return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

export const removeCommas = (string = 0) => {
  return _.isString(string) ? Number(string.replace(/[^0-9]/g, '')) : string
}
