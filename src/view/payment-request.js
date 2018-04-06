import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { NamedField } from '../component/field';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import Text from '../component/text';
import { BackButton, CopyButton, SmallButton } from '../component/button';
import { BalanceLabel } from '../component/label';
import Card from '../component/card';
import QRCode from '../component/qrcode';
import { colors } from '../component/style';

const styles = StyleSheet.create({
  content: {
    alignItems: 'stretch',
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
  doneTouchable: {
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 20,
  },
  doneText: {
    color: colors.purple,
    fontFamily: 'OpenSans SemiBold',
    fontSize: 14,
  }
});

const PaymentRequest = ({ store }) => (
  <Background image="purple-gradient-bg">
      <Header shadow color={colors.purple}>
      <BackButton onPress={() => {}} />
      <Title title="Payment Request" />
      <View style={styles.hiddenItem}>
        <BackButton onPress={() => {}} />
      </View>
    </Header>
    <Card style={styles.content}>
        <View style={styles.amountWrapper}>
          <BalanceLabel
            unit="SAT"
            style={styles.amount}
            numeralStyle={styles.numeral}
            unitStyle={styles.unit}
          >
            {store.paymentRequest.amount}
          </BalanceLabel>
        </View>
        <NamedField name="Note">{store.paymentRequest.message}</NamedField>
        <QRCode value={store.paymentRequest.invoice} />
        <CopyButton icon="copy-purple">{store.paymentRequest.invoice}</CopyButton>
        <SmallButton style={styles.doneTouchable}>
          <Text style={styles.doneText}>DONE</Text>
        </SmallButton>
    </Card>
  </Background>
);

PaymentRequest.propTypes = {
  amount: PropTypes.string,
  message: PropTypes.string,
  invoice: PropTypes.string,
};

export default observer(PaymentRequest);
