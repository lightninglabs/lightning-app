import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Select from './'

const options = [
  {
    value: 'btc',
    label: 'BTC',
  }, {
    value: 'usd',
    label: 'USD',
  }, {
    value: 'cad',
    label: 'CAD',
  },
]

storiesOf('Select', module)
  .add('select', () => (
    <Select options={ options } value="usd" />
  ))
