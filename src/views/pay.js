import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import Header from '../components/header';
import { Image, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

class Pay extends Component {
  render() {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Header
          text="Make a Payment"
          description="Lightning payments will be instant, while on-chain Bitcoin transactions require at least one confirmation (approx. 10 mins)"
        />
      </View>
    );
  }
}

export default observer(Pay);
