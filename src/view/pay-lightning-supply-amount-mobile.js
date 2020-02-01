import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { NamedField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, Button, SmallGlasButton } from '../component/button';
import Card from '../component/card';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { FormStretcher, FormSubText } from '../component/form';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import { color } from '../component/style';

const styles = StyleSheet.create({
  balance: {
    marginTop: 15,
  },
  unit: {
    color: color.blackText,
  },
  form: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  subText: {
    paddingTop: 40,
    paddingBottom: 40,
  },
});

const PayLightningSupplyAmountView = ({ store, nav, payment }) => (
  <Background color={color.purple}>
    <Header color={color.purple}>
      <Button disabled onPress={() => {}} />
      <Title title="Payment Request For Any Amount">
        <LightningBoltIcon height={12} width={6.1} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent>
      <Card style={styles.card}>
        <BalanceLabel style={styles.balance}>
          <AmountInputField
            autoFocus={true}
            value={store.invoice.amount}
            onChangeText={amount => payment.setAmount({ amount })}
            onSubmitEditing={() =>
              payment.checkAmountSuppliedAndGoPayLightningConfirm()
            }
          />
          <BalanceLabelUnit style={styles.unit}>
            {store.unitFiatLabel}
          </BalanceLabelUnit>
        </BalanceLabel>
        <FormStretcher style={styles.form}>
          {store.payment.note ? (
            <NamedField name="Note" style={styles.note}>
              {store.payment.note}
            </NamedField>
          ) : null}
        </FormStretcher>
        <FormSubText style={styles.subText}>
          Payment Request did not specify an amount. This is often used for
          tips/donations.
        </FormSubText>
      </Card>
    </MainContent>
    <SmallGlasButton
      onPress={() => payment.checkAmountSuppliedAndGoPayLightningConfirm()}
    >
      Pay
    </SmallGlasButton>
  </Background>
);

PayLightningSupplyAmountView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayLightningSupplyAmountView);
