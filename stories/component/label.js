import React from 'react';
import { storiesOf } from '@storybook/react';
import { LabelBalance } from '../../src/component/label';

storiesOf('Labels', module)
  .add('Balance SAT', () => (
    <LabelBalance unit="SAT" style={{ color: 'black' }}>
      9,123,456,788
    </LabelBalance>
  ))
  .add('Balance USD', () => (
    <LabelBalance fiat="$" style={{ color: 'black' }}>
      10,000
    </LabelBalance>
  ));
