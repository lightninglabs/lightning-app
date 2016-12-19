import React from 'react'

import { currencies } from '../../helpers'

export const Money = ({ currency, amount, sign }) => {
  const money = currencies.find(currency)

  return (
    <span>
      { sign ? `${ money.sign } ` : null }
      { money.format(amount) }
    </span>
  )
}

export default Money
