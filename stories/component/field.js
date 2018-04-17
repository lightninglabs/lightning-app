import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  InputField,
  NamedField,
  AmountInputField,
} from '../../src/component/field';

storiesOf('Field', module)
  .add('Input Field', () => (
    <InputField placeholder="Input Field" onChangeText={text => {}} />
  ))
  .add('Named Field', () => <NamedField name="Label">Named field</NamedField>)
  .add('Amount Input Field', () => (
    <AmountInputField onChangeText={text => {}} />
  ));
