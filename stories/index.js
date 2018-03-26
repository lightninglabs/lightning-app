import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Container from '../src/component/container';
import MainContent from '../src/component/main-content';
import Header from '../src/component/header';
import { Button, ButtonPill } from '../src/component/button';
import { LabelBalance } from '../src/component/label';
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
  <Container style={{ backgroundImage: colors.purpleGradient }}>
    <MainContent style={{ justifyContent: 'center' }}>
      <Text style={{ fontFamily }}>
        The quick brown fox jumps over the lazy dog.
      </Text>
    </MainContent>
  </Container>
);

storiesOf('Labels', module)
  .add('Balance SAT', () => (
    <LabelBalance unit="SAT" style={{ color: 'black' }}>
      9,123,456,788
    </LabelBalance>
  ))
  .add('Balance $', () => (
    <LabelBalance fiat="$" style={{ color: 'black' }}>
      10,000
    </LabelBalance>
  ));

storiesOf('Button', module)
  .add('Default', () => (
    <Container style={{ backgroundImage: colors.purpleGradient }}>
      <Button onPress={action('clicked')}>Default Button</Button>
    </Container>
  ))
  .add('Disabled', () => (
    <Container style={{ backgroundImage: colors.purpleGradient }}>
      <Button disabled onPress={action('clicked')}>
        Disabled Button
      </Button>
    </Container>
  ))
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

storiesOf('Layout', module).add('With Header', () => (
  <Container style={{ backgroundImage: colors.purpleGradient }}>
    <Header
      title="Lighting Payment"
      style={{ backgroundColor: colors.purple }}
    />
    <MainContent style={{ justifyContent: 'center' }}>
      <Text>qwre</Text>
      <Text>asdf</Text>
      <Text>yxcv</Text>
    </MainContent>
    <Button onPress={action('clicked')}>Continue</Button>
  </Container>
));
