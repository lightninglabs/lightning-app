import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import { Image, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

class Transactions extends Component {
  render() {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Text style={{ color: colors.gray, fontSize: 24, marginBottom: 14 }}>
          Your Transactions
        </Text>
        <Text style={{ color: colors.lightgray }}>
          This is a list of payments, including Lightning and on-chain
          transactions, sent to or from your wallet.
        </Text>
      </View>
    );
  }
}

export default observer(Transactions);
