import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
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

addDecorator(story => <Container>{story()}</Container>);

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
  <Background gradient={colors.purpleGradient}>
    <MainContent style={{ justifyContent: 'center' }}>
      <Text style={{ fontFamily }}>
        The quick brown fox jumps over the lazy dog.
      </Text>
    </MainContent>
  </Background>
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
  .addDecorator(story => (
    <Background gradient={colors.purpleGradient}>{story()}</Background>
  ))
  .add('Default', () => (
    <Button onPress={action('clicked')}>Default Button</Button>
  ))
  .add('Disabled', () => (
    <Button disabled onPress={action('clicked')}>
      Disabled Button
    </Button>
  ));

storiesOf('Button Pill', module)
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

storiesOf('Card', module)
  .addDecorator(story => (
    <Background gradient={colors.purpleGradient}>{story()}</Background>
  ))
  .add('Plain', () => <Card />);

storiesOf('Layout', module)
  .add('Button Bottom', () => (
    <Background gradient={colors.purpleGradient}>
      <MainContent style={{ justifyContent: 'center' }}>
        <LabelBalance unit="SAT">9,123,456,788</LabelBalance>
      </MainContent>
      <Button onPress={action('clicked')}>Continue</Button>
    </Background>
  ))
  .add('Card Form', () => (
    <Background gradient={colors.purpleGradient}>
      <Header title="Lightning Payment" />
      <Card>
        <Text style={{ color: colors.blackDark }}>
          Here are some instructions...
        </Text>
        <MainContent />
        <ButtonPill onPress={action('clicked')}>Next</ButtonPill>
      </Card>
    </Background>
  ));

storiesOf('Screens', module).add('Welcome', () => <WelcomeView />);
