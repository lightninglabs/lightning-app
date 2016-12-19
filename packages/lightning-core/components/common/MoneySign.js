import React from 'react'

import { currencies } from '../../helpers'

export const MoneySign = ({ currency }) => {
  const money = currencies.find(currency)

  return <span>{ money.sign }</span>
}

export default MoneySign
