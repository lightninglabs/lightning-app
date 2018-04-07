import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  BalanceLabel,
  SmallBalanceLabel,
  SmallLabel,
} from '../../src/component/label';
import { colors } from '../../src/component/style';

storiesOf('Labels', module)
  .add('Balance SAT', () => (
    <BalanceLabel unit="SAT" style={{ color: colors.blackText }}>
      9,123,456,788
    </BalanceLabel>
  ))
  .add('Balance USD', () => (
    <BalanceLabel style={{ color: colors.blackText }}>$10,000.00</BalanceLabel>
  ))
  .add('Small Balance SAT', () => (
    <SmallBalanceLabel unit="SAT" style={{ color: colors.blackText }}>
      9,123,456,788
    </SmallBalanceLabel>
  ))
  .add('Small Label', () => (
    <SmallLabel style={{ color: colors.blackText }}>Small Label</SmallLabel>
  ));
