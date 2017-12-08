import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import { Image, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

class Pay extends Component {
  render() {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Text style={{ color: colors.gray, fontSize: 24 }}>Make a Payment</Text>
        <Text style={{ color: colors.lightgray }}>
          Lightning payments will be instant, while on-chain Bitcoin
          transactions require at least one confirmation (approx. 10 mins)
        </Text>
      </View>
    );
  }
}

export default observer(Pay);
