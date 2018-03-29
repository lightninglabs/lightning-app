import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../../src/component/background';
import Header from '../../src/component/header';
import Icon from '../../src/component/icon';
import { colors } from '../../src/component/style';

storiesOf('Header', module)
  .add('Purple', () => (
    <Background image="purple-gradient-bg">
      <Header title="Purple Header" />
    </Background>
  ))
  .add('Orange with Icons', () => (
    <Background image="orange-gradient-bg">
      <Header
        title="Orange Header with Icons"
        style={{ backgroundColor: colors.orange }}
        onBack={action('back')}
        onCancel={action('cancel')}
      >
        <Icon image="lightning-bolt" style={{ height: 12, width: 6.1 }} />
      </Header>
    </Background>
  ));
