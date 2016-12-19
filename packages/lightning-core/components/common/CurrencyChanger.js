import React from 'react'
import _ from 'lodash'

import { Select } from 'lightning-components'
import { currencies } from '../../helpers'

export const CurrencyChanger = ({ currency, onChange }) => {
  const all = _.map(currencies.all, (label, value) => ({ value, label }))
  const handleChange = e => onChange(e.target.value)

  return (
    <Select options={ all } active={ currency } onChange={ handleChange } />
  )
}

export default CurrencyChanger
