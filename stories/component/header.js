import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../../src/component/background';
import { Header, Title } from '../../src/component/header';
import { BackButton, CancelButton } from '../../src/component/button';
import Icon from '../../src/component/icon';
import { colors } from '../../src/component/style';

storiesOf('Header', module)
  .add('Purple', () => (
    <Background image="purple-gradient-bg">
      <Header>
        <Title title="Purple Header" />
      </Header>
    </Background>
  ))
  .add('Orange with Icons', () => (
    <Background image="orange-gradient-bg">
      <Header style={{ backgroundColor: colors.orange }}>
        <BackButton onPress={action('back')} />
        <Title title="Orange Header with Icons">
          <Icon image="lightning-bolt" style={{ height: 12, width: 6.1 }} />
        </Title>
        <CancelButton onPress={action('cancel')} />
      </Header>
    </Background>
  ));
