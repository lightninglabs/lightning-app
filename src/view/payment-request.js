import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { NamedField } from '../component/field';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { BackButton, CopyButton, TextButton } from '../component/button';
import { LabelBalance } from '../component/label';
import Card from '../component/card';
import QRCode from '../component/qrcode';
import { colors } from '../component/style';

const styles = StyleSheet.create({
  content: {
    alignItems: 'stretch',
    width: '98%',
  },
  amount: {
    color: colors.darkText,
  },
  amountWrapper: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  hiddenItem: {
    // Workaround to align header items correctly.
    visibility: 'hidden',
  },
  numeral: {
    fontFamily: 'WorkSans ExtraLight',
    fontSize: 103,
    lineHeight: 100,
  },
  unit: {
    fontFamily: 'WorkSans Regular',
    fontSize: 23,
    lineHeight: 48,
    marginLeft: 10,
  },
});

const PaymentRequest = ({ amount, message, invoice }) => (
  <Background image="purple-gradient-bg">
    <Header>
      <BackButton onPress={() => {}} />
      <Title title="Payment Request" />
      <View style={styles.hiddenItem}>
        <BackButton onPress={() => {}} />
      </View>
    </Header>
    <Card>
      <MainContent style={styles.content}>
        <View style={styles.amountWrapper}>
          <LabelBalance
            unit="SAT"
            style={styles.amount}
            numeralStyle={styles.numeral}
            unitStyle={styles.unit}
          >
            {amount}
          </LabelBalance>
        </View>
        <NamedField name="Note">{message}</NamedField>
        <QRCode value={invoice} />
        <CopyButton icon="copy-purple">{invoice}</CopyButton>
        <TextButton onPress={() => {}}>Done</TextButton>
      </MainContent>
    </Card>
  </Background>
);

PaymentRequest.propTypes = {
  amount: PropTypes.string,
  message: PropTypes.string,
  invoice: PropTypes.string,
};

export default PaymentRequest;
