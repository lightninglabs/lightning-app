import React from 'react';
import { storiesOf } from '../storybook-react';
import { action } from '@storybook/addon-actions';
import {
  InputField,
  NamedField,
  DetailField,
  AmountInputField,
} from '../../src/component/field';

storiesOf('Field', module)
  .add('Input Field', () => (
    <InputField placeholder="Input Field" onChangeText={action('input')} />
  ))
  .add('Named Field', () => <NamedField name="Label">Named field</NamedField>)
  .add('Detail Field', () => (
    <DetailField name="Label">Detail field</DetailField>
  ))
  .add('Amount Input Field', () => (
    <AmountInputField onChangeText={action('amount')} />
  ));
