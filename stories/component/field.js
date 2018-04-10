import React from 'react';
import { storiesOf } from '@storybook/react';
import { NamedField } from '../../src/component/field';

storiesOf('Field', module).add('Named Field', () => (
  <NamedField name="Label">Named field</NamedField>
));
