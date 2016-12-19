/* eslint import/no-extraneous-dependencies: 0, import/no-named-as-default: 0 */

import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Text from './'

storiesOf('Text', module)
  .add('Foo Bar', () => (
    <Text>Foo Bar</Text>
  ))
  .add('`xl` `black` title', () => (
    <Text xl black>Transactions</Text>
  ))
  .add('`s` `light-gray` label', () => (
    <Text s light-gray>Small Label</Text>
  ))
  .add('`s` `teal` label', () => (
    <Text s teal>Small Label</Text>
  ))
  .add('`bold` Foo Bar', () => (
    <Text bold>Foo Bar</Text>
  ))
  .add('`uppercase` Foo Bar', () => (
    <Text uppercase>Foo Bar</Text>
  ))
