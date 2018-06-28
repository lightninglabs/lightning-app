import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { NamedField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, BackButton, PillButton } from '../component/button';
import Card from '../component/card';
import Icon from '../component/icon';
import { FormStretcher, FormText } from '../component/form';
import {
  BalanceLabel,
  BalanceLabelNumeral,
  BalanceLabelUnit,
} from '../component/label';
import { color } from '../component/style';

const styles = StyleSheet.create({
  description: {
    paddingLeft: 60,
    paddingRight: 60,
  },
  balance: {
    marginBottom: 10,
  },
  numeral: {
    color: color.blackText,
  },
  unit: {
    color: color.blackText,
  },
  btcIcon: {
    height: 170 * 0.08,
    width: 135 * 0.08,
  },
  totalLbl: {
    marginTop: 5,
  },
  confirmBtn: {
    marginTop: 20,
    backgroundColor: color.orange,
  },
});

const PayBitcoinConfirmView = ({ store, nav, payment }) => (
  <Background image="orange-gradient-bg">
    <Header shadow color={color.orange}>
      <BackButton onPress={() => nav.goBack()} />
      <Title title="On-Chain Confirmation">
        <Icon image="bitcoin" style={styles.btcIcon} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent>
      <Card>
        <FormText style={styles.description}>
          You are about to send a Bitcoin payment on-chain.
        </FormText>
        <FormStretcher>
          <BalanceLabel style={styles.balance}>
            <BalanceLabelNumeral style={styles.numeral}>
              {store.paymentAmountLabel}
            </BalanceLabelNumeral>
            <BalanceLabelUnit style={styles.unit}>
              {store.unit}
            </BalanceLabelUnit>
          </BalanceLabel>
          <NamedField name="Fee">
            {store.paymentFeeLabel} {store.unit}
          </NamedField>
          <NamedField name="Total" style={styles.totalLbl}>
            {store.paymentTotalLabel} {store.unit}
          </NamedField>
        </FormStretcher>
        <PillButton
          style={styles.confirmBtn}
          onPress={() => payment.payBitcoin()}
        >
          Confirm
        </PillButton>
      </Card>
    </MainContent>
  </Background>
);

PayBitcoinConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayBitcoinConfirmView);
