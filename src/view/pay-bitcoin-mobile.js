import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import {
  MaxButton,
  CancelButton,
  BackButton,
  SmallGlasButton,
} from '../component/button';
import Card from '../component/card';
import BitcoinIcon from '../asset/icon/bitcoin';
import { FormStretcher, FormText } from '../component/form';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import { color } from '../component/style';

const styles = StyleSheet.create({
  description: {
    maxWidth: 290,
  },
  unit: {
    color: color.blackText,
  },
  maxBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
  nextBtn: {
    marginTop: 20,
    backgroundColor: color.orange,
  },
});

const PayBitcoinView = ({ store, nav, payment }) => (
  <Background color={color.orange}>
    <Header color={color.orange}>
      <BackButton onPress={() => nav.goPay()} />
      <Title title="Bitcoin Payment">
        <BitcoinIcon height={13.6} width={10.8} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent>
      <Card>
        <FormText style={styles.description}>
          You are about to initiate an on-chain payment. It could take 10
          minutes or more to confirm.
        </FormText>
        <FormStretcher>
          <BalanceLabel>
            <AmountInputField
              autoFocus={true}
              value={store.payment.amount}
              onChangeText={amount => payment.setAmount({ amount })}
              onSubmitEditing={() => payment.initPayBitcoinConfirm()}
            />
            <BalanceLabelUnit style={styles.unit}>
              {store.unitFiatLabel}
            </BalanceLabelUnit>
          </BalanceLabel>
          <MaxButton
            style={styles.maxBtn}
            active={store.payment.sendAll}
            onPress={() => payment.toggleMax()}
          />
          <InputField
            placeholder="Bitcoin Address"
            value={store.payment.address}
            onChangeText={address => payment.setAddress({ address })}
            onSubmitEditing={() => payment.initPayBitcoinConfirm()}
          />
        </FormStretcher>
      </Card>
    </MainContent>
    <SmallGlasButton onPress={() => payment.initPayBitcoinConfirm()}>
      Next
    </SmallGlasButton>
  </Background>
);

PayBitcoinView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayBitcoinView);
