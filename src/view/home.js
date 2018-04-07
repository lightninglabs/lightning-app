import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import Icon from '../component/icon';
import { Header, Title } from '../component/header';
import { colors } from '../component/style';
import {
  BalanceLabel,
  SmallBalanceLabel,
  SmallLabel,
} from '../component/label';
import {
  Button,
  QrButton,
  SmallButton,
  GlasButton,
  DownButton,
} from '../component/button';

//
// Home View
//

const styles = StyleSheet.create({
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  downBtn: {
    margin: 25,
  },
});

const HomeView = ({ store, wallet, nav }) => {
  const { balanceLabel, channelBalanceLabel, unitLabel } = store;
  return (
    <Background image="purple-gradient-bg">
      <HomeHeader
        goChannels={() => nav.goChannels()}
        goSettings={() => nav.goSettings()}
      />
      <QrCodeSeparator goFundWallet={() => nav.goFundWallet()} />
      <MainContent style={styles.content}>
        <BalanceDisplay
          balanceLabel={balanceLabel}
          channelBalanceLabel={channelBalanceLabel}
          unitLabel={unitLabel}
          toggleDisplayFiat={() => wallet.toggleDisplayFiat()}
        />
        <SendReceiveButton
          goPay={() => nav.goPay()}
          goRequest={() => nav.goRequest()}
        />
        <DownButton onPress={() => nav.goTransactions()} style={styles.downBtn}>
          Transactions
        </DownButton>
      </MainContent>
    </Background>
  );
};

HomeView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Balance Display
//

const balanceStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  smallLabel: {
    marginTop: 30,
    marginBottom: 5,
  },
});

const BalanceDisplay = ({
  balanceLabel,
  channelBalanceLabel,
  unitLabel,
  toggleDisplayFiat,
}) => (
  <View style={balanceStyles.wrapper}>
    <Button onPress={toggleDisplayFiat}>
      <BalanceLabel unit={unitLabel}>{channelBalanceLabel}</BalanceLabel>
      <SmallLabel style={balanceStyles.smallLabel}>Pending Deposit</SmallLabel>
      <SmallBalanceLabel unit={unitLabel}>{balanceLabel}</SmallBalanceLabel>
    </Button>
  </View>
);

BalanceDisplay.propTypes = {
  balanceLabel: PropTypes.string.isRequired,
  channelBalanceLabel: PropTypes.string.isRequired,
  unitLabel: PropTypes.string,
  toggleDisplayFiat: PropTypes.func.isRequired,
};

//
// Send Receive Button
//

const bigBtnStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  leftBtn: {
    flex: 1,
    borderTopLeftRadius: 21,
    borderBottomLeftRadius: 21,
  },
  rightBtn: {
    flex: 1,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
  },
  boltWrapper: {
    justifyContent: 'center',
    backgroundColor: colors.glas,
  },
  bolt: {
    height: 126 * 0.4,
    width: 64 * 0.4,
  },
});

const SendReceiveButton = ({ goPay, goRequest }) => (
  <View style={bigBtnStyles.wrapper}>
    <GlasButton onPress={goRequest} style={bigBtnStyles.leftBtn}>
      Receive
    </GlasButton>
    <View style={bigBtnStyles.boltWrapper}>
      <Icon image="lightning-bolt-purple" style={bigBtnStyles.bolt} />
    </View>
    <GlasButton onPress={goPay} style={bigBtnStyles.rightBtn}>
      Pay
    </GlasButton>
  </View>
);

SendReceiveButton.propTypes = {
  goPay: PropTypes.func.isRequired,
  goRequest: PropTypes.func.isRequired,
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
      <SmallButton
        border
        alert={colors.pinkSig}
        text="Channels"
        onPress={goChannels}
      />
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
    height: 30,
    top: -1,
  },
  separator: {
    flex: 1,
    height: 1,
    boxShadow: `0 0.25px ${colors.white}`,
  },
  button: {
    width: 43,
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

export default observer(HomeView);
