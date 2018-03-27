import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Container from '../src/component/container';
import Background from '../src/component/background';
import MainContent from '../src/component/main-content';
import Header from '../src/component/header';
import { Button, ButtonPill } from '../src/component/button';
import { LabelBalance } from '../src/component/label';
import Card from '../src/component/card';
import Text from '../src/component/text';
import { colors } from '../src/component/styles';

import WelcomeView from '../src/view/welcome';

storiesOf('Colors', module)
  .add('Primary Purple', () => (
    <Container>
      <Background color={colors.purple} />
    </Container>
  ))
  .add('Purple Gradient', () => (
    <Container>
      <Background gradient={colors.purpleGradient} />
    </Container>
  ))
  .add('Purple Textured', () => (
    <Container>
      <Background image="textured-bg" />
    </Container>
  ))
  .add('Primary Orange', () => (
    <Container>
      <Background color={colors.orange} />
    </Container>
  ))
  .add('Orange Gradient', () => (
    <Container>
      <Background gradient={colors.orangeGradient} />
    </Container>
  ))
  .add('Dark Mode Black', () => (
    <Container>
      <Background color={colors.blackDark} />
    </Container>
  ))
  .add('Background White', () => (
    <Container>
      <Background color={colors.whiteBg} />
    </Container>
  ))
  .add('Strait Up White', () => (
    <Container>
      <Background color={colors.white} />
    </Container>
  ))
  .add('Good Green', () => (
    <Container>
      <Background color={colors.greenSig} />
    </Container>
  ))
  .add('Average Orange', () => (
    <Container>
      <Background color={colors.orangeSig} />
    </Container>
  ))
  .add('Bad Pink', () => (
    <Container>
      <Background color={colors.pinkSig} />
    </Container>
  ))
  .add('Active Field Blue', () => (
    <Container>
      <Background color={colors.blueSig} />
    </Container>
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
  .add('Balance USD', () => (
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

storiesOf('Header', module)
  .add('Purple', () => (
    <Container style={{ backgroundImage: colors.purpleGradient }}>
      <Header title="Purple" />
    </Container>
  ))
  .add('Orange', () => (
    <Container style={{ backgroundImage: colors.orangeGradient }}>
      <Header title="Orange" style={{ backgroundColor: colors.orange }} />
    </Container>
  ));

storiesOf('Card', module).add('Plain', () => (
  <Container style={{ backgroundImage: colors.purpleGradient }}>
    <Card />
  </Container>
));

storiesOf('Layout', module)
  .add('Button Bottom', () => (
    <Container style={{ backgroundImage: colors.purpleGradient }}>
      <MainContent style={{ justifyContent: 'center' }}>
        <LabelBalance unit="SAT">9,123,456,788</LabelBalance>
      </MainContent>
      <Button onPress={action('clicked')}>Continue</Button>
    </Container>
  ))
  .add('Card Form', () => (
    <Container style={{ backgroundImage: colors.purpleGradient }}>
      <Header title="Lightning Payment" />
      <Card>
        <Text style={{ color: colors.blackDark }}>
          Here are some instructions...
        </Text>
        <MainContent />
        <ButtonPill onPress={action('clicked')}>Next</ButtonPill>
      </Card>
    </Container>
  ));

storiesOf('Screens', module).add('Welcome', () => (
  <Container>
    <WelcomeView />
  </Container>
));
