import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { NamedField } from '../component/field';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { BackButton, CopyButton, TextButton } from '../component/button';
import { LabelAmount } from '../component/label';
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
  done: {
    alignSelf: 'center',
    margin: 35,
  },
  hiddenItem: {
    // Workaround to align header items correctly.
    visibility: 'hidden',
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
          <LabelAmount unit="SAT" style={styles.amount}>
            {amount}
          </LabelAmount>
        </View>
        <NamedField name="Note">{message}</NamedField>
        <QRCode value={invoice} />
        <CopyButton icon="copy-purple">{invoice}</CopyButton>
        <TextButton style={styles.done} onPress={() => {}}>
          Done
        </TextButton>
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
