import React from 'react';
import { storiesOf } from '@storybook/react';
import Background from '../src/component/background';
import { colors } from '../src/component/style';

storiesOf('Colors', module)
  .add('Primary Purple', () => <Background color={colors.purple} />)
  .add('Purple Gradient', () => <Background gradient={colors.purpleGradient} />)
  .add('Purple Textured', () => <Background image="textured-bg" />)
  .add('Primary Orange', () => <Background color={colors.orange} />)
  .add('Orange Gradient', () => <Background gradient={colors.orangeGradient} />)
  .add('Dark Mode Black', () => <Background color={colors.blackDark} />)
  .add('Background White', () => <Background color={colors.whiteBg} />)
  .add('Strait Up White', () => <Background color={colors.white} />)
  .add('Good Green', () => <Background color={colors.greenSig} />)
  .add('Average Orange', () => <Background color={colors.orangeSig} />)
  .add('Bad Pink', () => <Background color={colors.pinkSig} />)
  .add('Active Field Blue', () => <Background color={colors.blueSig} />);
