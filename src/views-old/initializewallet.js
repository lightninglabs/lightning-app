import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { nav } from '../actions';
import { Text, TextB } from '../components-old/text';
import Button from '../components-old/button';
import { View } from 'react-native';
import store from '../store';

class InitializeWallet extends Component {
  render() {
    const { settings: { seedMnemonic } } = store;
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextB style={{ fontSize: 24 }}>Initialize Wallet</TextB>
        <Text style={{ fontSize: 20 }}>Write down these words</Text>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            margin: 4,
            marginTop: 16,
            padding: 14,
            shadowRadius: 4,
            shadowOpacity: 0.3,
            shadowColor: 'black',
            shadowOffset: { width: 1, height: 1 },
          }}
        >
          <Text style={{ fontSize: 22 }}>{seedMnemonic}</Text>
        </View>

        <Button text="Next" onPress={() => nav.goVerifyWallet()} />
      </View>
    );
  }
}

export default observer(InitializeWallet);
