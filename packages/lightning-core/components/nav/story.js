import React from 'react'
import { storiesOf } from '@kadira/storybook'

import NavLinks from './NavLinks'
import NavFooter from './NavFooter'

const user = {
  identity: 'case@casesandberg.com',
  amount: '5.3021',
  denomination: 'BTC',
}

storiesOf('NavLinks', module)
  .add('send money `active`', () => (
    <NavLinks active="send-money" />
  ))
  .add('transactions `active`', () => (
    <NavLinks active="transactions" />
  ))

storiesOf('NavFooter', module)
  .add('`case@casesandberg.com` `8.5412`', () => (
    <NavFooter { ...user } />
  ))
