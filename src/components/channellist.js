import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from './text';
import ComponentIcon from './icon';
import ChannelListItem from './channellistitem';
import { colors, layout } from '../styles';

const ChannelList = ({ channels }) => (
  <ScrollView style={{ flex: 1 }}>
    {channels && channels.length ? (
      channels.map((channel, i) => <ChannelListItem {...channel} key={i} />)
    ) : (
      <NoChannelsPlaceHolder />
    )}
  </ScrollView>
);

const NoChannelsPlaceHolder = () => (
  <View>
    <ComponentIcon icon="playlist-remove"
      style={{ width: 54, height: 54, alignSelf: 'center', color: colors.lightgray }} />
    <Text style={{ color: colors.lightgray, alignSelf: 'center', fontSize: 22 }}>
      No Channels Yet
    </Text>
  </View>
);

export default ChannelList;
