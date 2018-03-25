import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';

import Container from '../src/component/container';
import MainContent from '../src/component/main-content';
import Button from '../src/component/button';
import Text from '../src/component/text';
import { colors } from '../src/component/styles';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Screen', module).add('prototype', () => (
  <Container style={{ backgroundImage: colors.purpleGradient }}>
    <MainContent style={{ justifyContent: 'center' }}>
      <Text>qwre</Text>
      <Text>asdf</Text>
      <Text>yxcv</Text>
    </MainContent>
    <Button onPress={action('clicked')}>Continue</Button>
  </Container>
));
