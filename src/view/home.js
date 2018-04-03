import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { BalanceLabel } from '../component/label';
import { Header, Title } from '../component/header';
import { QrButton, SmallButton } from '../component/button';
import Icon from '../component/icon';
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
      <HomeHeader goChannels={() => {}} goSettings={() => {}} />
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
// Home Header
//

const headerStyles = StyleSheet.create({
  btnWrapperLeft: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
  },
  btnWrapperRight: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsIcon: {
    height: 14.7,
    width: 14,
  },
});

const HomeHeader = ({ goChannels, goSettings }) => (
  <Header>
    <View style={headerStyles.btnWrapperLeft}>
      <SmallButton border text="Channels" onPress={goChannels} />
    </View>
    <Title title="Wallet" />
    <View style={headerStyles.btnWrapperRight}>
      <SmallButton text="Settings" onPress={goSettings}>
        <Icon image="settings" style={headerStyles.settingsIcon} />
      </SmallButton>
    </View>
  </Header>
);

HomeHeader.propTypes = {
  goChannels: PropTypes.func.isRequired,
  goSettings: PropTypes.func.isRequired,
};

//
// QR Code Separator
//

const qrStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    top: -1,
  },
  separator: {
    flex: 1,
    height: 1,
    boxShadow: `0 0.25px ${colors.white}`,
  },
  button: {
    width: 42,
    top: -19,
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
