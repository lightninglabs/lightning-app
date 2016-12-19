import React from 'react'

import { currencies } from '../../helpers'

export const MoneyCode = ({ currency }) => {
  const money = currencies.find(currency)

  return <span>{ money.code }</span>
}

export default MoneyCode
