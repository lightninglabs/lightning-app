import _ from 'lodash'
import { addCommas, removeCommas } from './helper'

const toBTC = (sat) => {
  return removeCommas(sat) / 100000000
}

const currencies = {
  sat: {
    sign: 'SAT',
    value: 'SAT',
    format: (sat) => {
      const number = removeCommas(sat).toFixed(0)
      return addCommas(number)
    },
  },
  btc: {
    sign: '฿',
    value: 'BTC',
    format: (sat) => {
      const number = toBTC(sat).toFixed(4)
      const split = number.split('.')
      return `${ addCommas(split[0]) }.${ split[1] }`
    },
  },
  usd: {
    sign: '$',
    value: 'USD',
    format: (sat) => {
      return addCommas((toBTC(sat) * 1194.99).toFixed(2))
    },
  },
  eur: {
    sign: '€',
    value: 'EUR',
    format: (sat) => {
      return addCommas((toBTC(sat) * 1131.87).toFixed(2))
    },
  },
}

const missing = {
  sign: '?',
  value: 'N/A',
  format: () => 'MISSING',
}

export const getCurrency = id => currencies[id] || missing
export const getCurrencyValues = _.mapValues(currencies, 'code')
