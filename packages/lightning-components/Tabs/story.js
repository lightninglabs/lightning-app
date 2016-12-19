import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Tabs from './'

const tabs = [
  {
    label: 'Recent',
    value: 'recent',
  },
  {
    label: 'In Progress',
    value: 'in-progress',
  },
  {
    label: 'Complete',
    value: 'complete',
  },
]

storiesOf('Tabs', module)
  .add('tabs', () => (
    <Tabs selected="in-progress" color="#fff" inactive="#333" background="#59D9A4" tabs={ tabs } />
  ))
