import React from 'react';
import { storiesOf } from '../storybook-react';
import { action } from '@storybook/addon-actions';
import PasswordEntry from '../../src/component/password-entry';

storiesOf('Password Entry', module)
  .add('Password Entry', () => (
    <PasswordEntry
      placeholder="New password"
      autoFocus={true}
      onChangeText={action('input')}
      onSubmitEditing={() => {}}
    />
  ))
  .add('Password Entry (Success)', () => (
    <PasswordEntry
      placeholder="New password"
      value="asdfasdf"
      onChangeText={action('input')}
      onSubmitEditing={() => {}}
      success={true}
    />
  ))
  .add('Password Entry (Error)', () => (
    <PasswordEntry
      placeholder="New password"
      value="asdf"
      onChangeText={action('input')}
      onSubmitEditing={() => {}}
      success={false}
    />
  ));
