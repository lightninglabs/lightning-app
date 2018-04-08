import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  BalanceLabel,
  BalanceLabelNumeral,
  BalanceLabelUnit,
  SmallBalanceLabel,
  SmallLabel,
} from '../../src/component/label';
import { colors } from '../../src/component/style';

storiesOf('Labels', module)
  .add('Balance SAT', () => (
    <BalanceLabel>
      <BalanceLabelNumeral style={{ color: colors.blackText }}>
        9,123,456,788
      </BalanceLabelNumeral>
      <BalanceLabelUnit style={{ color: colors.blackText }}>
        SAT
      </BalanceLabelUnit>
    </BalanceLabel>
  ))
  .add('Balance USD', () => (
    <BalanceLabel>
      <BalanceLabelNumeral style={{ color: colors.blackText }}>
        $10,000.00
      </BalanceLabelNumeral>
    </BalanceLabel>
  ))
  .add('Small Balance SAT', () => (
    <SmallBalanceLabel unit="SAT" style={{ color: colors.blackText }}>
      9,123,456,788
    </SmallBalanceLabel>
  ))
  .add('Small Label', () => (
    <SmallLabel style={{ color: colors.blackText }}>Small Label</SmallLabel>
  ));
