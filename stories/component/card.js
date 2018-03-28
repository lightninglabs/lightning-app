import React from 'react';
import { storiesOf } from '@storybook/react';
import Background from '../../src/component/background';
import Card from '../../src/component/card';
import { colors } from '../../src/component/style';

storiesOf('Card', module)
  .addDecorator(story => (
    <Background gradient={colors.purpleGradient}>{story()}</Background>
  ))
  .add('Plain', () => <Card />);
