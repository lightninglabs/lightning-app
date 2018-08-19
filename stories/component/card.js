import React from 'react';
import { storiesOf } from '@storybook/react';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import Card, { PasswordCard } from '../../src/component/card';

storiesOf('Card', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'flex-end' }}>
        {story()}
      </MainContent>
    </Background>
  ))
  .add('Plain', () => <Card />)
  .add('Password', () => (
    <PasswordCard
      copy="Type the new password you would like to use below. Make sure it's at least 6 alphanumeric characters and symbols."
      placeholder="New password"
      password="password"
      onChangeText={() => {}}
      onSubmit={() => {}}
      newPassword={true}
      border="red"
    />
  ));
