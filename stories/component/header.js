import React from 'react';
import { storiesOf } from '@storybook/react';
import Background from '../../src/component/background';
import Header from '../../src/component/header';
import { colors } from '../../src/component/styles';

storiesOf('Header', module)
  .add('Purple', () => (
    <Background gradient={colors.purpleGradient}>
      <Header title="Purple Header" />
    </Background>
  ))
  .add('Orange', () => (
    <Background gradient={colors.orangeGradient}>
      <Header
        title="Orange Header"
        style={{ backgroundColor: colors.orange }}
      />
    </Background>
  ));
