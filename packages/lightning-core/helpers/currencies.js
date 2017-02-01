import _ from 'lodash'

export const addCommas = (number) => {
  return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

export const removeCommas = (string = 0) => {
  return _.isString(string) ? Number(string.replace(/[^0-9]/g, '')) : string
}

export const enforceNumbers = (string = '') => string.replace(/[^0-9]/g, '')

const toBTC = (sat) => {
  return removeCommas(sat) / 100000000
}

const currencies = {
  satoshi: {
    sign: 'SAT',
    code: 'SAT',
    format: (sat) => {
      const number = removeCommas(sat).toFixed(0)
      return addCommas(number)
    },
  },
  btc: {
    sign: '฿',
    code: 'BTC',
    format: (sat) => {
      const number = toBTC(sat).toFixed(4)
      const split = number.split('.')
      return `${ addCommas(split[0]) }.${ split[1] }`
    },
  },
  usd: {
    sign: '$',
    code: 'USD',
    format: (sat) => {
      return addCommas((toBTC(sat) * 606.59).toFixed(2))
    },
  },
  eur: {
    sign: '€',
    code: 'EUR',
    format: (sat) => {
      return addCommas((toBTC(sat) * 539.42).toFixed(2))
    },
  },
}

export const getAll = () => _.mapValues(currencies, 'code')

export default {
  find: (id) => {
    return currencies[id] || { sign: 'MISSING', format: () => { return 'MISSING' } }
  },
  all: _.mapValues(currencies, 'code'),
}
