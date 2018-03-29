import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../src/component/background';
import MainContent from '../src/component/main-content';
import { Header, Title } from '../src/component/header';
import {
  Button,
  PillButton,
  BackButton,
  CancelButton,
} from '../src/component/button';
import { LabelBalance } from '../src/component/label';
import Card from '../src/component/card';
import Text from '../src/component/text';
import Icon from '../src/component/icon';
import { colors } from '../src/component/style';

storiesOf('Layout', module)
  .add('Button Bottom', () => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>
        <LabelBalance unit="SAT">9,123,456,788</LabelBalance>
      </MainContent>
      <Button onPress={action('clicked')}>Continue</Button>
    </Background>
  ))
  .add('Card Form', () => (
    <Background image="purple-gradient-bg">
      <Header>
        <BackButton onPress={action('back')} />
        <Title title="Lightning Payment">
          <Icon image="lightning-bolt" style={{ height: 12, width: 6.1 }} />
        </Title>
        <CancelButton onPress={action('cancel')} />
      </Header>
      <Card>
        <Text style={{ color: colors.blackDark }}>
          Here are some instructions...
        </Text>
        <MainContent />
        <PillButton onPress={action('clicked')}>Next</PillButton>
      </Card>
    </Background>
  ));
