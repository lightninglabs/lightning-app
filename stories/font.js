import React from 'react';
import { storiesOf } from '@storybook/react';
import Background from '../src/component/background';
import MainContent from '../src/component/main-content';
import Text from '../src/component/text';

storiesOf('Fonts', module)
  .add('OpenSans Light', () => renderFont('OpenSans Light'))
  .add('OpenSans Regular', () => renderFont('OpenSans Regular'))
  .add('OpenSans SemiBold', () => renderFont('OpenSans SemiBold'))
  .add('OpenSans Bold', () => renderFont('OpenSans Bold'))
  .add('Poppins Thin', () => renderFont('Poppins Thin'))
  .add('Poppins ExtraLight', () => renderFont('Poppins ExtraLight'))
  .add('Poppins Light', () => renderFont('Poppins Light'))
  .add('Poppins Regular', () => renderFont('Poppins Regular'))
  .add('Poppins Medium', () => renderFont('Poppins Medium'))
  .add('Poppins SemiBold', () => renderFont('Poppins SemiBold'))
  .add('Poppins Bold', () => renderFont('Poppins Bold'))
  .add('WorkSans Thin', () => renderFont('WorkSans Thin'))
  .add('WorkSans ExtraLight', () => renderFont('WorkSans ExtraLight'))
  .add('WorkSans Light', () => renderFont('WorkSans Light'))
  .add('WorkSans Regular', () => renderFont('WorkSans Regular'))
  .add('WorkSans Medium', () => renderFont('WorkSans Medium'))
  .add('WorkSans SemiBold', () => renderFont('WorkSans SemiBold'))
  .add('WorkSans Bold', () => renderFont('WorkSans Bold'));

const renderFont = fontFamily => (
  <Background image="purple-gradient-bg">
    <MainContent style={{ justifyContent: 'center' }}>
      <Text style={{ fontFamily, fontSize: 24 }}>
        The quick brown fox jumps over the lazy dog.
      </Text>
    </MainContent>
  </Background>
);
