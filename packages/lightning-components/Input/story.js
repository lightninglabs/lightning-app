import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Input from './'

storiesOf('Input', module)
  .add('Input', () => (
    <Input placeholder="identity@hostname" />
  ))
  .add('`large` Input', () => (
    <Input large value="Some Value" />
  ))
