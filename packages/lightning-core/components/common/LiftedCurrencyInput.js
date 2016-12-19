import React from 'react'

import { LiftedInput } from 'lightning-components'
import currencies, { removeCommas } from '../../helpers/currencies'

export const LiftedCurrencyInput = (props) => {
  const currency = currencies.find(props.currency)
  const handleChange = (e) => {
    props.onChange && props.onChange({ target: { value: removeCommas(e.target.value) } })
  }
  return (
    <LiftedInput
      { ...props }
      type="text"
      onChange={ handleChange }
      placeholder={ currency.format(props.placeholder) }
      value={ currency.format(props.value) }
    />
  )
}

export default LiftedCurrencyInput
