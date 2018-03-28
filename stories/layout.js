import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../src/component/background';
import MainContent from '../src/component/main-content';
import Header from '../src/component/header';
import { Button, ButtonPill } from '../src/component/button';
import { LabelBalance } from '../src/component/label';
import Card from '../src/component/card';
import Text from '../src/component/text';
import { colors } from '../src/component/style';

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
