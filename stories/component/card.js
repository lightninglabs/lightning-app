import React from 'react';
import { storiesOf } from '@storybook/react';
import Background from '../../src/component/background';
import Card from '../../src/component/card';

storiesOf('Card', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">{story()}</Background>
  ))
  .add('Plain', () => <Card />);
