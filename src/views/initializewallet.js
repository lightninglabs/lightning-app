import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ActionsNav from '../actions/nav';
import { Text, TextB } from '../components/text';
import TextInput from '../components/textinput';
import Button from '../components/button';
import { colors } from '../styles';
import { Image, View, TouchableOpacity } from 'react-native';
import store from '../store';

class InitializeWallet extends Component {
  render() {
    const { settings: { seedMnemonic } } = store;
    return (
      <View
        style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          backgroundColor: colors.offwhite,
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

        <Button text="Next" onPress={() => ActionsNav.goVerifyWallet()} />
      </View>
    );
  }
}

export default observer(InitializeWallet);
