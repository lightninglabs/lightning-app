import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Alert } from '../component/notification';
import { color } from '../component/style';
import { H4Text } from '../component/text';
import Icon from '../component/icon';
import QrIcon from '../asset/icon/qr';
import LightningBoltPurpleIcon from '../asset/icon/lightning-bolt-purple';
import { BalanceLabel, BalanceLabelNumeral } from '../component/label';
import { Button, GlasButton, DownButton } from '../component/button';

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

const HomeView = ({
  store,
  wallet,
  channel,
  payment,
  invoice,
  transaction,
  nav,
}) => {
  const {
    totalBalanceLabel,
    unitLabel,
    channelStatus,
    channelPercentageLabel,
  } = store;
  return (
    <Background image="purple-gradient-bg">
      <HomeHeader
        isTestnet={store.network === 'testnet'}
        goDeposit={() => nav.goDeposit()}
        goSettings={() => nav.goSettings()}
      />
      <MainContent style={styles.content}>
        <BalanceDisplay
          totalBalanceLabel={totalBalanceLabel}
          unitLabel={unitLabel}
          channelStatus={channelStatus}
          channelPercentageLabel={channelPercentageLabel}
          toggleDisplayFiat={() => wallet.toggleDisplayFiat()}
          goChannels={() => channel.init()}
        />
        <SendReceiveButton
          goPay={() => payment.init()}
          goRequest={() => invoice.init()}
        />
        <DownButton onPress={() => transaction.init()} style={styles.downBtn}>
          Transactions
        </DownButton>
      </MainContent>
    </Background>
  );
};

HomeView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Balance Display
//

const balanceStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 30,
  },
  percentBtn: {
    flexDirection: 'row',
  },
  alert: {
    marginRight: 6,
  },
});

const BalanceDisplay = ({
  totalBalanceLabel,
  unitLabel,
  channelStatus,
  channelPercentageLabel,
  toggleDisplayFiat,
  goChannels,
}) => (
  <View style={balanceStyles.wrapper}>
    <Button onPress={toggleDisplayFiat}>
      {unitLabel ? <H4Text>Total {unitLabel}</H4Text> : null}
      <BalanceLabel>
        <BalanceLabelNumeral>{totalBalanceLabel}</BalanceLabelNumeral>
      </BalanceLabel>
    </Button>
    <Button onPress={goChannels} style={balanceStyles.percentBtn}>
      <Alert type={channelStatus} style={balanceStyles.alert} />
      <H4Text>{channelPercentageLabel}</H4Text>
    </Button>
  </View>
);

BalanceDisplay.propTypes = {
  totalBalanceLabel: PropTypes.string.isRequired,
  unitLabel: PropTypes.string,
  channelStatus: PropTypes.string.isRequired,
  channelPercentageLabel: PropTypes.string.isRequired,
  toggleDisplayFiat: PropTypes.func.isRequired,
  goChannels: PropTypes.func.isRequired,
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
    backgroundColor: color.glas,
  },
});

const SendReceiveButton = ({ goPay, goRequest }) => (
  <View style={bigBtnStyles.wrapper}>
    <GlasButton onPress={goRequest} style={bigBtnStyles.leftBtn}>
      Request
    </GlasButton>
    <View style={bigBtnStyles.boltWrapper}>
      <LightningBoltPurpleIcon height={126 * 0.4} width={64 * 0.4} />
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
  depositBtn: {
    marginLeft: 3,
  },
  testnet: {
    fontSize: 10,
    lineHeight: 16,
  },
  settingsBtn: {
    marginRight: 3,
  },
  settingsIcon: {
    height: 22,
    width: 22,
  },
});

const HomeHeader = ({ isTestnet, goDeposit, goSettings }) => (
  <Header separator={Platform.OS === 'web'}>
    <Button onPress={goDeposit} style={headerStyles.depositBtn}>
      <QrIcon height={40 * 0.6} width={39 * 0.6} />
    </Button>
    <View>
      {isTestnet ? (
        <Title style={headerStyles.testnet} title="testnet" />
      ) : null}
      <Title title="Wallet" />
    </View>
    <Button onPress={goSettings} style={headerStyles.settingsBtn}>
      <Icon
        image={require('../asset/icon/settings.png')}
        style={headerStyles.settingsIcon}
      />
    </Button>
  </Header>
);

HomeHeader.propTypes = {
  isTestnet: PropTypes.bool.isRequired,
  goDeposit: PropTypes.func.isRequired,
  goSettings: PropTypes.func.isRequired,
};

export default observer(HomeView);
