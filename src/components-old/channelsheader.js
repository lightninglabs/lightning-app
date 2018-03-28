import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from './text';
import { colors, layout } from './styles';

const styles = {
  header: {
    padding: 20,
    backgroundColor: colors.blue,
  },
  walletContainer: {
    flex: 0.5,
  },
  wallet: {
    marginBottom: 6,
    color: colors.black,
    fontSize: 24,
  },
  balance: {
    marginBottom: 6,
    color: 'white',
    fontSize: 28,
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
  },
  pubKeyLabel: {
    color: colors.black,
    marginBottom: 4,
    flex: 0.4,
  },
  pubKey: {
    color: 'white',
    flex: 0.6,
    fontSize: 14,
  },
  onChain: {
    marginBottom: 8,
    fontSize: 14,
    color: colors.black,
  },
  inChannels: {
    fontSize: 14,
    color: colors.black,
  },
  margin: {
    margin: 10,
  },
  computedBalance: {
    marginBottom: 8,
    fontSize: 14,
    color: 'white',
  },
  computedChannelsBalance: {
    fontSize: 14,
    color: 'white',
  },
  topContainer: {
    alignItems: 'baseline',
  },
};

const ChannelsHeader = ({
  computedBalance,
  computedChannelsBalance,
  pubKey,
  ipAddress,
}) => (
  <View style={styles.header}>
    <View style={[layout.flexRow, styles.topContainer]}>
      <View style={styles.walletContainer}>
        <Text style={styles.wallet}>Your Wallet</Text>
        <Text style={styles.balance}>{computedBalance} SAT</Text>
      </View>
      <View style={styles.walletContainer}>
        <View style={layout.flexRow}>
          <Text style={styles.pubKeyLabel}>On Chain:</Text>
          <Text style={styles.pubKey}>{computedBalance} SAT</Text>
        </View>
        <View style={layout.flexRow}>
          <Text style={styles.pubKeyLabel}>In Channels:</Text>
          <Text style={styles.pubKey}>{computedChannelsBalance} SAT</Text>
        </View>
      </View>
    </View>
    <View style={styles.body}>
      <View style={layout.flexRow}>
        <Text style={styles.pubKey}>
          {ipAddress ? `${pubKey}@${ipAddress}` : pubKey}
        </Text>
      </View>
    </View>
  </View>
);

ChannelsHeader.propTypes = {
  computedBalance: PropTypes.string,
  computedChannelsBalance: PropTypes.string,
  pubKey: PropTypes.string,
  ipAddress: PropTypes.string,
};

export default ChannelsHeader;
