import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { NamedField } from '../component/field';
import { Header, Title } from '../component/header';
import {
  BackButton,
  CopyButton,
  Button,
  ButtonText,
} from '../component/button';
import {
  BalanceLabel,
  BalanceLabelNumeral,
  BalanceLabelUnit,
} from '../component/label';
import Card from '../component/card';
import Icon from '../component/icon';
import QRCode from '../component/qrcode';
import { color } from '../component/style';

const styles = StyleSheet.create({
  card: {
    paddingBottom: 0,
  },
  balance: {
    marginTop: 25,
    marginBottom: 40,
  },
  numeral: {
    lineHeight: 70,
    fontSize: 103,
    color: color.blackText,
  },
  unit: {
    lineHeight: 20,
    fontSize: 23,
    color: color.blackText,
  },
  qrcode: {
    margin: 40,
  },
  copyBtn: {
    alignSelf: 'stretch',
  },
  doneBtn: {
    marginTop: 10,
  },
  doneBtnText: {
    color: color.purple,
  },
});

const RequestQRView = ({ store, nav }) => (
  <Background image="purple-gradient-bg">
    <Header shadow color={color.purple}>
      <BackButton onPress={() => {}} />
      <Title title="Payment Request">
        <Icon image="lightning-bolt" style={{ height: 12, width: 6.1 }} />
      </Title>
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent>
      <Card style={styles.card}>
        <BalanceLabel style={styles.balance}>
          <BalanceLabelNumeral style={styles.numeral}>
            {store.paymentRequest.amount}
          </BalanceLabelNumeral>
          <BalanceLabelUnit style={styles.unit}>{store.unit}</BalanceLabelUnit>
        </BalanceLabel>
        <NamedField name="Note">{store.paymentRequest.message}</NamedField>
        <QRCode style={styles.qrcode}>{store.paymentRequest.invoice}</QRCode>
        <CopyButton
          onPress={() => {}}
          icon="copy-purple"
          style={styles.copyBtn}
        >
          {store.paymentRequest.invoice}
        </CopyButton>
        <Button onPress={() => nav.goHome()} style={styles.doneBtn}>
          <ButtonText style={styles.doneBtnText}>DONE</ButtonText>
        </Button>
      </Card>
    </MainContent>
  </Background>
);

RequestQRView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(RequestQRView);
