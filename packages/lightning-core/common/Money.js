import React from 'react'

import { currencies } from '../helpers'

export const Money = ({ currency, amount, sign }) => {
  const money = currencies.find(currency)

  return (
    <span>
      { sign ? `${ money.sign } ` : null }
      { money.format(amount) }
    </span>
  )
}

export const MoneyCode = ({ currency }) => {
  const money = currencies.find(currency)

  return <span>{ money.code }</span>
}

export const MoneySign = ({ currency }) => {
  const money = currencies.find(currency)

  return <span>{ money.sign }</span>
}
