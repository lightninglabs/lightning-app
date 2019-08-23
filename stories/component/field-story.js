import React from 'react';
import { storiesOf } from '../storybook-react';
import { action } from '@storybook/addon-actions';
import {
  InputField,
  NamedField,
  NamedFieldSelect,
  DetailField,
  AmountInputField,
} from '../../src/component/field';

storiesOf('Field', module)
  .add('Input Field', () => (
    <InputField placeholder="Input Field" onChangeText={action('input')} />
  ))
  .add('Named Field', () => <NamedField name="Label">Named field</NamedField>)
  .add('Named Field Select', () => (
    <NamedFieldSelect name="Label" onPress={action('select')}>
      Named field Select
    </NamedFieldSelect>
  ))
  .add('Detail Field', () => (
    <DetailField name="Label">Detail field</DetailField>
  ))
  .add('Amount Input Field', () => (
    <AmountInputField onChangeText={action('amount')} />
  ));
