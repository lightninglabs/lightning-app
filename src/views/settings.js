import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import { Image, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

class Settings extends Component {
  render() {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Text style={{ color: colors.gray, fontSize: 24, marginBottom: 14 }}>
          Settings
        </Text>
        <Text style={{ color: colors.lightgray }}>
          Settings and logs for your wallet and the Lightning app
        </Text>
      </View>
    );
  }
}

export default observer(Settings);
