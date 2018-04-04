import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../src/component/background';
import MainContent from '../src/component/main-content';
import { Header, Title } from '../src/component/header';
import {
  GlasButton,
  PillButton,
  BackButton,
  CancelButton,
} from '../src/component/button';
import { BalanceLabel } from '../src/component/label';
import Card from '../src/component/card';
import Text from '../src/component/text';
import Icon from '../src/component/icon';
import { colors } from '../src/component/style';

storiesOf('Layout', module)
  .add('Button Bottom', () => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>
        <BalanceLabel unit="SAT">9,123,456,788</BalanceLabel>
      </MainContent>
      <GlasButton onPress={action('clicked')}>Continue</GlasButton>
    </Background>
  ))
  .add('Card Form', () => (
    <Background image="purple-gradient-bg">
      <Header shadow color={colors.purple}>
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
