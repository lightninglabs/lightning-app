import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, PillButton, Button } from '../component/button';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import Card from '../component/card';
import Icon from '../component/icon';
import { FormStretcher, FormSubText } from '../component/form';
import { color } from '../component/style';

const styles = StyleSheet.create({
  balance: {
    marginTop: 40,
  },
  unit: {
    color: color.blackText,
  },
});

const RequestView = ({ store, nav }) => (
  <Background image="purple-gradient-bg">
    <Header shadow color={color.purple}>
      <Button disabled onPress={() => {}} />
      <Title title="Payment Request">
        <Icon image="lightning-bolt" style={{ height: 12, width: 6.1 }} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent>
      <Card>
        <BalanceLabel style={styles.balance}>
          <AmountInputField onChangeText={() => {}} />
          <BalanceLabelUnit style={styles.unit}>{store.unit}</BalanceLabelUnit>
        </BalanceLabel>
        <FormStretcher>
          <InputField placeholder="Note" />
        </FormStretcher>
        <FormSubText>
          Generate a payment request that others can use to pay you immediately
          via the Lightning Network.
        </FormSubText>
        <PillButton onPress={() => nav.goRequestQR()}>Next</PillButton>
      </Card>
    </MainContent>
  </Background>
);

RequestView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(RequestView);
