import React from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from './text';
import ComponentIcon from './icon';
import ChannelListItem from './channellistitem';
import { colors, layout } from './styles';

const styles = {
  placeHolderIcon: {
    width: 54,
    height: 54,
    alignSelf: 'center',
    color: colors.lightgray,
  },
  placeHolderText: {
    color: colors.lightgray,
    alignSelf: 'center',
    fontSize: 22,
  },
};

const ChannelList = ({ channels }) => (
  <ScrollView style={layout.flex}>
    {channels && channels.length ? (
      channels.map((channel, i) => <ChannelListItem {...channel} key={i} />)
    ) : (
      <NoChannelsPlaceHolder />
    )}
  </ScrollView>
);

const NoChannelsPlaceHolder = () => (
  <View>
    <ComponentIcon icon="playlist-remove" style={styles.placeHolderIcon} />
    <Text style={styles.placeHolderText}>No Channels Yet</Text>
  </View>
);

ChannelList.propTypes = {
  channels: PropTypes.array,
};

export default ChannelList;
