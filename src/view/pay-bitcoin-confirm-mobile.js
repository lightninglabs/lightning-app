import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { NamedField } from '../component/field';
import { NamedFieldSelect } from '../component/field-mobile';
import { Header, Title } from '../component/header';
import { CancelButton, BackButton, SmallGlasButton } from '../component/button';
import Card from '../component/card';
import BitcoinIcon from '../asset/icon/bitcoin';
import { FormStretcher, FormText } from '../component/form';
import {
  BalanceLabel,
  BalanceLabelNumeral,
  BalanceLabelUnit,
} from '../component/label';
import { color } from '../component/style';

const styles = StyleSheet.create({
  description: {
    maxWidth: 290,
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
  <Background color={color.orange}>
    <Header color={color.orange}>
      <BackButton onPress={() => nav.goPayBitcoin()} />
      <Title title="Bitcoin Payment">
        <BitcoinIcon height={13.6} width={10.8} />
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
              {store.unitLabel}
            </BalanceLabelUnit>
          </BalanceLabel>
          <NamedFieldSelect
            name="Fee"
            items={store.paymentFeeEstimateItems}
            value={store.payment.targetConf}
            onValueChange={targetConf => payment.setTargetConf({ targetConf })}
          />
          <NamedField name="Total" style={styles.totalLbl}>
            {store.paymentTotalLabel} {store.unitLabel}
          </NamedField>
        </FormStretcher>
      </Card>
    </MainContent>
    <SmallGlasButton onPress={() => payment.payBitcoin()}>
      Confirm
    </SmallGlasButton>
  </Background>
);

PayBitcoinConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayBitcoinConfirmView);
