import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Media from './'
import { Icon, Text } from '../'

storiesOf('Media', module)
  .add('`left` `black` Icon With Label', () => (
    <Media black left={ <Icon name="swap-horizontal" /> }>
      <Text inherit>Transactions</Text>
    </Media>
  ))
  .add('`right` `teal` `inline` Icon With Label', () => (
    <Media teal inline right={ <Icon name="arrow-right-bold-circle-outline" /> }>
      <Text inherit>Transactions</Text>
    </Media>
  ))
