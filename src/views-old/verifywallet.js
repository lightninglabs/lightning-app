import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { nav } from '../action';
import { Text, TextB } from '../components-old/text';
import TextInput from '../components-old/textinput';
import Button from '../components-old/button';
import { View } from 'react-native';
import store from '../store';

class VerifyWallet extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
    };
  }

  render() {
    const { value } = this.state;
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
        <Text style={{ fontSize: 20 }}>Re-enter your seed</Text>

        <View style={{}}>
          <TextInput
            style={{ width: 650 }}
            value={value}
            onChangeText={value => this.setState({ value })}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Button text="Back" onPress={() => nav.goInitializeWallet()} />
          <Button
            disabled={value !== seedMnemonic}
            text="Done"
            onPress={() => nav.goPay()}
          />
        </View>
      </View>
    );
  }
}

export default observer(VerifyWallet);
