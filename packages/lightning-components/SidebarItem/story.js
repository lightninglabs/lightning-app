import React from 'react'
import { storiesOf } from '@kadira/storybook'

import SidebarItem from './'

storiesOf('SidebarItem', module)
  .add('transactions', () => (
    <SidebarItem label="Transactions" icon="swap-horizontal" />
  ))
  .add('`active` transactions', () => (
    <SidebarItem active label="Transactions" icon="swap-horizontal" />
  ))
