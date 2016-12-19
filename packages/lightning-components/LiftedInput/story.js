import React from 'react'
import { storiesOf } from '@kadira/storybook'

import LiftedInput from './'

storiesOf('LiftedInput', module)
  .add('LiftedInput', () => (
    <LiftedInput value="Foo Bar" />
  ))
  .add('`large` `number` LiftedInput', () => (
    <LiftedInput placeholder="$3,000" type="number" large />
  ))
