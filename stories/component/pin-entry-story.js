import React from 'react';
import { storiesOf } from '../storybook-react';
import { action } from '@storybook/addon-actions';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import { PinBubbles, PinKeyboard } from '../../src/component/pin-entry';

storiesOf('PIN Entry (Mobile)', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
    </Background>
  ))
  .add('PIN Entry (Mobile)', () => <PinBubbles pin={'123'} />)
  .add('PIN Keyboard (Mobile)', () => (
    <PinKeyboard
      onInput={action('digit input')}
      onBackspace={action('delete')}
    />
  ));
