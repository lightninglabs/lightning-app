import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import Header from '../components/header';
import { Image, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

class Transactions extends Component {
  render() {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Header
          text="Your Transactions"
          description="This is a list of payments, including Lightning and on-chain transactions, sent to or from your wallet."
        />
      </View>
    );
  }
}

export default observer(Transactions);
