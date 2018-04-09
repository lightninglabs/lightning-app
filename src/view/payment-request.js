import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { NamedField } from '../component/field';
import { Header, Title } from '../component/header';
import Text from '../component/text';
import {
  BackButton,
  CopyButton,
  SmallButton,
  Button,
} from '../component/button';
import {
  BalanceLabel,
  BalanceLabelNumeral,
  BalanceLabelUnit,
} from '../component/label';
import Card from '../component/card';
import QRCode from '../component/qrcode';
import { colors } from '../component/style';

const styles = StyleSheet.create({
  card: {
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  amount: {
    color: colors.blackText,
  },
  amountWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  numeral: {
    lineHeight: 70,
    fontSize: 103,
    color: colors.blackText,
  },
  unit: {
    lineHeight: 20,
    fontSize: 23,
    color: colors.blackText,
  },
  doneTouchable: {
    height: 50,
    width: 100,
    margin: 20,
  },
  doneText: {
    color: colors.purple,
    fontFamily: 'OpenSans SemiBold',
    fontSize: 14,
  },
});

const PaymentRequest = ({ store }) => (
  <Background image="purple-gradient-bg">
    <Header shadow color={colors.purple} style={styles.header}>
      <BackButton onPress={() => {}} />
      <Title title="Payment Request" />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent>
      <Card style={styles.card}>
        <View style={styles.amountWrapper}>
          <BalanceLabel>
            <BalanceLabelNumeral style={styles.numeral}>
              {store.paymentRequest.amount}
            </BalanceLabelNumeral>
            <BalanceLabelUnit style={styles.unit}>SAT</BalanceLabelUnit>
          </BalanceLabel>
        </View>
        <NamedField name="Note">{store.paymentRequest.message}</NamedField>
        <QRCode value={store.paymentRequest.invoice} />
        <CopyButton icon="copy-purple">
          {store.paymentRequest.invoice}
        </CopyButton>
        <SmallButton onPress={() => {}} style={styles.doneTouchable}>
          <Text style={styles.doneText}>DONE</Text>
        </SmallButton>
      </Card>
    </MainContent>
  </Background>
);

PaymentRequest.propTypes = {
  store: PropTypes.object.isRequired,
};

export default observer(PaymentRequest);
