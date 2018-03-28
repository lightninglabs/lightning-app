import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text } from '../components-old/text';
import ChannelsHeader from '../components-old/channelsheader';
import Separator from '../components-old/separator';
import ChannelList from '../components-old/channellist';
import { View, TouchableOpacity } from 'react-native';
import { nav } from '../action';
import { colors } from '../components-old/styles';
import store from '../store';

class Channels extends Component {
  render() {
    const {
      computedBalance,
      computedChannelsBalance,
      pubKey,
      computedChannels,
      ipAddress,
    } = store;
    return (
      <View style={{ flex: 1, backgroundColor: colors.offwhite }}>
        <ChannelsHeader
          computedBalance={computedBalance}
          computedChannelsBalance={computedChannelsBalance}
          pubKey={pubKey}
          ipAddress={ipAddress}
        />

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
              onPress={() => nav.goCreateChannel()}
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
