import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../../src/component/background';
import { Button, ButtonPill } from '../../src/component/button';
import { colors } from '../../src/component/style';

storiesOf('Button', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">{story()}</Background>
  ))
  .add('Default', () => (
    <Button onPress={action('clicked')}>Default Button</Button>
  ))
  .add('Disabled', () => (
    <Button disabled onPress={action('clicked')}>
      Disabled Button
    </Button>
  ));

storiesOf('Button', module)
  .add('Pill', () => (
    <ButtonPill onPress={action('clicked')}>Pill Button</ButtonPill>
  ))
  .add('Pill Disabled', () => (
    <ButtonPill disabled onPress={action('clicked')}>
      Pill Disabled
    </ButtonPill>
  ))
  .add('Pill Orange', () => (
    <ButtonPill
      style={{ backgroundColor: colors.orange }}
      onPress={action('clicked')}
    >
      Pill Button
    </ButtonPill>
  ));
