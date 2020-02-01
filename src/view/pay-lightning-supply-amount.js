import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { NamedField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, BackButton, PillButton } from '../component/button';
import Card from '../component/card';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { FormStretcher, FormSubText } from '../component/form';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import { color } from '../component/style';

const styles = StyleSheet.create({
  description: {
    paddingLeft: 20,
    paddingRight: 20,
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
    backgroundColor: color.purple,
  },
  subText: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
});

const PayLightningSupplyAmountView = ({ store, nav, payment }) => (
  <Background image="purple-gradient-bg">
    <Header color={color.purple}>
      <BackButton onPress={() => nav.goHome()} />
      <Title title="Payment Request For Any Amount">
        <LightningBoltIcon height={12} width={6.1} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent>
      <Card>
        <BalanceLabel style={styles.balance}>
          <AmountInputField
            autoFocus={true}
            value={store.payment.amount}
            onChangeText={amount => payment.setAmount({ amount })}
            onSubmitEditing={() =>
              payment.checkAmountSuppliedAndGoPayLightningConfirm()
            }
          />
          <BalanceLabelUnit style={styles.unit}>
            {store.unitFiatLabel}
          </BalanceLabelUnit>
        </BalanceLabel>
        <FormStretcher>
          {store.payment.note ? (
            <NamedField name="Note" style={styles.note}>
              {store.payment.note}
            </NamedField>
          ) : null}
          <FormSubText style={styles.subText}>
            Payment Request did not specify an amount. This is often used for
            tips/donations.
          </FormSubText>
        </FormStretcher>
        <PillButton
          style={styles.nextBtn}
          onPress={() => payment.checkAmountSuppliedAndGoPayLightningConfirm()}
        >
          Pay
        </PillButton>
      </Card>
    </MainContent>
  </Background>
);

PayLightningSupplyAmountView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayLightningSupplyAmountView);
