import React from 'react'
import { storiesOf } from '@kadira/storybook'

import CurrencyChanger from './CurrencyChanger'
import Identity from './Identity'
import Money from './Money'
import MoneySign from './MoneySign'

storiesOf('CurrencyChanger', module)
  .add('changer', () => (
    <CurrencyChanger />
  ))

storiesOf('Identity', module)
  .add('identity', () => (
    <Identity name="foo@bar.com" user="bar@foo.baz" ellipsis />
  ))
  .add('identity same name and user', () => (
    <Identity name="foo@bar.com" user="foo@bar.com" ellipsis />
  ))

storiesOf('Money', module)
  .add('money', () => (
    <Money amount={ 3.4315123 } currency="btc" />
  ))
  .add('money with sign', () => (
    <Money sign amount={ 3.4315123 } currency="btc" />
  ))
  .add('usd', () => (
    <Money amount={ 3.4315123 } currency="usd" />
  ))
  .add('usd with sign', () => (
    <Money sign amount={ 3.4315123 } currency="usd" />
  ))

storiesOf('MoneySign', module)
  .add('btc sign', () => (
    <MoneySign currency="btc" />
  ))
  .add('usd sign', () => (
    <MoneySign currency="usd" />
  ))
