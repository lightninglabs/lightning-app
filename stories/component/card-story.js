import React from 'react';
import { storiesOf } from '../storybook-react';
import { action } from '@storybook/addon-actions';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import Card from '../../src/component/card';
import { PasswordCard } from '../../src/component/password-entry';

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
      onChangeText={action('input')}
      onSubmitEditing={() => {}}
      success={null}
    />
  ));
