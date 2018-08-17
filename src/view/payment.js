import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, PillButton, Button } from '../component/button';
import Card from '../component/card';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { FormStretcher, FormText, FormSubText } from '../component/form';
import { color } from '../component/style';

const styles = StyleSheet.create({
  description: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  },
  subText: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
});

const PaymentView = ({ store, nav, payment }) => (
  <Background image="purple-gradient-bg">
    <Header shadow color={color.purple}>
      <Button disabled onPress={() => {}} />
      <Title title="Lightning Payment">
        <LightningBoltIcon height={12} width={6.1} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent>
      <Card>
        <FormText style={styles.description}>
          Paste the Lightning Payment Request or the Bitcoin Address to which
          you’re sending.
        </FormText>
        <FormStretcher>
          <InputField
            placeholder="Payment Request / Bitcoin Address"
            autoFocus={true}
            value={store.payment.address}
            onChangeText={address => payment.setAddress({ address })}
            onSubmitEditing={() => payment.checkType()}
          />
          <FormSubText style={styles.subText}>
            Only Lightning Payment Requests or Bitcoin addresses will work at
            this time.
          </FormSubText>
        </FormStretcher>
        <PillButton onPress={() => payment.checkType()}>Next</PillButton>
      </Card>
    </MainContent>
  </Background>
);

PaymentView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PaymentView);
