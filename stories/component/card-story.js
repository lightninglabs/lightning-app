import React from 'react';
import { storiesOf } from '../storybook-react';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import Card from '../../src/component/card';

storiesOf('Card', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent>{story()}</MainContent>
    </Background>
  ))
  .add('Plain', () => <Card />);
