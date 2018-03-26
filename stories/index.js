import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Container from '../src/component/container';
import MainContent from '../src/component/main-content';
import Header from '../src/component/header';
import Button from '../src/component/button';
import Text from '../src/component/text';
import { colors } from '../src/component/styles';

storiesOf('Colors', module)
  .add('Primary Purple', () => (
    <Container style={{ backgroundColor: colors.purple }} />
  ))
  .add('Purple Gradient', () => (
    <Container style={{ backgroundImage: colors.purpleGradient }} />
  ))
  .add('Primary Orange', () => (
    <Container style={{ backgroundColor: colors.orange }} />
  ))
  .add('Orange Gradient', () => (
    <Container style={{ backgroundImage: colors.orangeGradient }} />
  ))
  .add('Dark Mode Black', () => (
    <Container style={{ backgroundColor: colors.blackDark }} />
  ))
  .add('Background White', () => (
    <Container style={{ backgroundColor: colors.whiteBg }} />
  ))
  .add('Strait Up White', () => (
    <Container style={{ backgroundColor: colors.white }} />
  ))
  .add('Good Green', () => (
    <Container style={{ backgroundColor: colors.greenSig }} />
  ))
  .add('Average Orange', () => (
    <Container style={{ backgroundColor: colors.orangeSig }} />
  ))
  .add('Bad Pink', () => (
    <Container style={{ backgroundColor: colors.pinkSig }} />
  ))
  .add('Active Field Blue', () => (
    <Container style={{ backgroundColor: colors.blueSig }} />
  ));

storiesOf('Screen', module).add('prototype', () => (
  <Container style={{ backgroundImage: colors.purpleGradient }}>
    <Header title="Title" style={{ backgroundColor: colors.purple }} />
    <MainContent style={{ justifyContent: 'center' }}>
      <Text>qwre</Text>
      <Text>asdf</Text>
      <Text>yxcv</Text>
    </MainContent>
    <Button onPress={action('clicked')}>Continue</Button>
  </Container>
));
