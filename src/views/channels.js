import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import Separator from '../components/separator';
import ChannelList from '../components/channellist';
import { Image, View, TouchableOpacity } from 'react-native';
import ActionsNav from '../actions/nav';
import { colors } from '../styles';
import store from '../store';

class Channels extends Component {
  render() {
    const { computedBalance, computedChannelsBalance, pubKey, computedChannels } = store;
    return (
      <View style={{ flex: 1, backgroundColor: colors.offwhite }}>
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

        <View style={{ padding: 20 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ marginBottom: 6, color: colors.black, fontSize: 24 }}
            >
              Your Channels
            </Text>
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => ActionsNav.goCreateChannel()}
            >
              <Text style={{ color: colors.blue, fontSize: 12 }}>
                CREATE CHANNEL
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: colors.gray, fontSize: 16, marginBottom: 10 }}>
            Channels are like tubes of money used to send money through the
            network
          </Text>

          <Separator />

          <ChannelList channels={computedChannels} />
        </View>
      </View>
    );
  }
}

export default observer(Channels);
