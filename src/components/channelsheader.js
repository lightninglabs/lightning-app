import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from './text';
import { colors, layout } from '../styles';

const styles = {
  header: {
    padding: 20,
    backgroundColor: colors.blue,
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
  },
  pubKey: {
    color: colors.black,
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
};

const ChannelsHeader = ({
  computedBalance,
  computedChannelsBalance,
  pubKey,
}) => (
  <View style={styles.header}>
    <Text style={styles.wallet}>Your Wallet</Text>
    <Text style={styles.balance}>{computedBalance} SAT</Text>
    <View style={styles.body}>
      <View style={layout.flex}>
        <Text style={styles.pubKeyLabel}>Pubkey:</Text>
        <Text style={styles.pubKey}>{pubKey}</Text>
      </View>
      <View style={styles.margin}>
        <Text style={styles.onChain}>On Chain</Text>
        <Text style={styles.inChannels}>In Channels</Text>
      </View>
      <View style={styles.margin}>
        <Text style={styles.computedBalance}>{computedBalance} SAT</Text>
        <Text style={styles.computedChannelsBalance}>
          {computedChannelsBalance} SAT
        </Text>
      </View>
    </View>
  </View>
);

ChannelsHeader.propTypes = {
  computedBalance: PropTypes.string,
  computedChannelsBalance: PropTypes.string,
  pubKey: PropTypes.string,
};

export default ChannelsHeader;
