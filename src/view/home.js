import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { BalanceLabel } from '../component/label';
import { Header, Title } from '../component/header';
import { QrButton } from '../component/button';
import { colors } from '../component/style';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const Home = ({ store }) => {
  const { channelBalanceLabel, unitLabel } = store;
  return (
    <Background image="purple-gradient-bg">
      <Header>
        <Title title="Wallet" />
      </Header>
      <QrCodeSeparator goFundWallet={() => {}} />
      <MainContent style={styles.content}>
        <BalanceLabel unit={unitLabel}>{channelBalanceLabel}</BalanceLabel>
      </MainContent>
    </Background>
  );
};

Home.propTypes = {
  store: PropTypes.object.isRequired,
};

//
// QR Code Separator
//

const qrStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    top: -20,
  },
  button: {
    width: 42,
  },
  separator: {
    flex: 1,
    height: 1,
    boxShadow: `0 0.25px ${colors.white}`,
    marginBottom: 21,
  },
});

const QrCodeSeparator = ({ goFundWallet }) => (
  <View style={qrStyles.wrapper}>
    <View style={qrStyles.separator} />
    <QrButton image="qr" onPress={goFundWallet} style={qrStyles.button}>
      Add coin
    </QrButton>
    <View style={qrStyles.separator} />
  </View>
);

QrCodeSeparator.propTypes = {
  goFundWallet: PropTypes.func.isRequired,
};

export default observer(Home);
