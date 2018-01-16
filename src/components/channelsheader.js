import React from 'react';
import { View } from 'react-native';
import { Text } from './text';
import { colors } from '../styles';

const ChannelsHeader = ({ computedBalance, computedChannelsBalance, pubKey }) => (
  <View style={{ padding: 20, backgroundColor: colors.blue }}>
    <Text style={{ marginBottom: 6, color: colors.black, fontSize: 24 }}>
      Your Wallet
    </Text>
    <Text style={{ marginBottom: 6, color: 'white', fontSize: 28 }}>
      {computedBalance} SAT
    </Text>

    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.black, marginBottom: 4 }}>
          Pubkey:
        </Text>
        <Text style={{ color: colors.black }}>{pubKey}</Text>
      </View>
      <View style={{ margin: 10 }}>
        <Text
          style={{ marginBottom: 8, fontSize: 14, color: colors.black }}
        >
          On Chain
        </Text>
        <Text style={{ fontSize: 14, color: colors.black }}>
          In Channels
        </Text>
      </View>
      <View style={{ margin: 10 }}>
        <Text style={{ marginBottom: 8, fontSize: 14, color: 'white' }}>
          {computedBalance} SAT
        </Text>
        <Text style={{ fontSize: 14, color: 'white' }}>
          {computedChannelsBalance} SAT
        </Text>
      </View>
    </View>
  </View>
);

export default ChannelsHeader;
