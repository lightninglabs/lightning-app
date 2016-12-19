import React from 'react'
import { storiesOf } from '@kadira/storybook'

import Box from './'
import { Icon } from '../'

const Placeholder = () => {
  return (
    <div style={{ width: '50px', height: '50px', borderRadius: '4px', border: '2px dashed #ddd' }} />
  )
}

storiesOf('Box', module)
  .add('Boxes', () => (
    <Box>
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))
  .add('Boxes `direction="row"`', () => (
    <Box direction="row">
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))
  .add('Boxes `direction="row"` `align="right"` `verticalAlign="bottom"`', () => (
    <Box direction="row" align="right" verticalAlign="bottom">
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))
  .add('Boxes `direction="column"`', () => (
    <Box direction="column">
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))
  .add('Boxes `direction="column"` `align="left"` `verticalAlign="bottom"`', () => (
    <Box direction="column" align="left" verticalAlign="bottom">
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))
  .add('Boxes `background="teal"`', () => (
    <Box background="teal">
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))
  .add('Boxes `color="teal"`', () => (
    <Box color="teal">
      <span style={{ fontSize: '24px' }}>Text</span>
    </Box>
  ))
  .add('Icon `vertical-bottom` `horizontal-right`', () => (
    <Box vertical="bottom" horizontal="right" style={{ position: 'absolute' }}>
      <Icon name="swap-horizontal" />
    </Box>
  ))
  .add('`padding-l` Icon', () => (
    <Box padding-l>
      <Icon name="swap-horizontal" />
    </Box>
  ))
  .add('`top-xl` `left-s` Icon', () => (
    <Box top-xl left-s>
      <Icon name="swap-horizontal" />
    </Box>
  ))
