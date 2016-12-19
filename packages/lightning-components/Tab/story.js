import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Tab from './'

storiesOf('Tab', module)
  .add('recent', () => (
    <Tab color="blue" inactive="#333">recent</Tab>
  ))
  .add('`active` recent', () => (
    <Tab selected color="blue" inactive="#333">recent</Tab>
  ))
