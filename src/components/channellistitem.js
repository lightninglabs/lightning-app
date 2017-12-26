import React from 'react';
import { View } from 'react-native';
import { Text } from './text';
import Seperator from './seperator';

const ChannelListItem = ({ channel }) => (
  <View>
    <Text>a channel component</Text>
    <Seperator />
  </View>
);

export default ChannelListItem;
