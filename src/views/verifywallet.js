import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ActionsNav from '../actions/nav';
import { Text, TextB } from '../components/text';
import TextInput from '../components/textinput';
import Button from '../components/button';
import { colors } from '../styles';
import { Image, View, TouchableOpacity } from 'react-native';
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
          <Button text="Back" onPress={() => ActionsNav.goInitializeWallet()} />
          <Button
            disabled={value !== seedMnemonic}
            text="Done"
            onPress={() => ActionsNav.goPay()}
          />
        </View>
      </View>
    );
  }
}

export default observer(VerifyWallet);
