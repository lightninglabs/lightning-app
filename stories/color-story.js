import React from 'react';
import { storiesOf } from './storybook-react';
import Background from '../src/component/background';
import { color } from '../src/component/style';

storiesOf('Colors', module)
  .add('Primary Purple', () => <Background color={color.purple} />)
  .add('Purple Gradient', () => <Background image="purple-gradient-bg" />)
  .add('Purple Textured', () => <Background image="textured-bg" />)
  .add('Primary Orange', () => <Background color={color.orange} />)
  .add('Orange Gradient', () => <Background image="orange-gradient-bg" />)
  .add('Dark Mode Black', () => <Background color={color.blackDark} />)
  .add('Background White', () => <Background color={color.whiteBg} />)
  .add('Strait Up White', () => <Background color={color.white} />)
  .add('Good Green', () => <Background color={color.greenSig} />)
  .add('Average Orange', () => <Background color={color.orangeSig} />)
  .add('Bad Pink', () => <Background color={color.pinkSig} />)
  .add('Active Field Blue', () => <Background color={color.blueSig} />);
