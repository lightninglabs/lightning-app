import React from 'react';
import { storiesOf } from '@storybook/react';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import Icon from '../../src/component/icon';

storiesOf('Icons', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
    </Background>
  ))
  .add('Back', () => <Icon image="back" style={{ height: 20, width: 12 }} />)
  .add('Cancel', () => (
    <Icon image="cancel" style={{ height: 21, width: 21 }} />
  ));
