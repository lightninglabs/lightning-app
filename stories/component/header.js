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
      <Header shadow color={colors.purple}>
        <Title title="Purple with Shadow" />
      </Header>
    </Background>
  ))
  .add('Orange with Icons', () => (
    <Background image="orange-gradient-bg">
      <Header shadow color={colors.orange}>
        <BackButton onPress={action('back')} />
        <Title title="Orange with Icons">
          <Icon image="lightning-bolt" style={{ height: 12, width: 6.1 }} />
        </Title>
        <CancelButton onPress={action('cancel')} />
      </Header>
    </Background>
  ))
  .add('Dark Mode', () => (
    <Background color={colors.blackDark}>
      <Header separator>
        <BackButton onPress={action('back')} />
        <Title title="Dark with Separator" />
        <CancelButton onPress={action('cancel')} />
      </Header>
    </Background>
  ));
