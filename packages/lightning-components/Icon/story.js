import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Icon from './'

storiesOf('Icon', module)
  .add('`swap-horizontal` icon', () => (
    <Icon name="swap-horizontal" onClick={ action('button clicked') } />
  ))
  .add('`chart-bubble` icon', () => (
    <Icon name="chart-bubble" onClick={ action('button clicked') } />
  ))
  .add('`n/a` icon', () => (
    <Icon name="foo-bar" onClick={ action('button clicked') } />
  ))
  .add('small icon', () => (
    <Icon name="swap-horizontal" small />
  ))
  .add('`teal` icon', () => (
    <Icon name="swap-horizontal" small teal />
  ))
