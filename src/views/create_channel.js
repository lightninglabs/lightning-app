import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import TextInput from '../components/textinput';
import Button from '../components/button';
import { Image, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles';
import store from '../store';

class CreateChannel extends Component {
  constructor() {
    super();

    this.state = {
      pubkey: '',
      amount: '',
    };
  }

  render() {
    const { pubkey, amount } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: colors.offwhite, padding: 20 }}>
        <Text style={{ color: colors.gray, fontSize: 24, marginBottom: 14 }}>
          Create Channel
        </Text>
        <Text style={{ color: colors.lightgray }}>
          Channels are like tubes of money used to transfer funds within
          Lightning
        </Text>

        <TextInput
          placeholder="Pubkey@HostIP"
          value={pubkey}
          onChangeText={pubkey => this.setState({ pubkey })}
        />

        <TextInput
          rightText="SAT"
          placeholder="Amount"
          value={amount}
          onChangeText={amount =>
            this.setState({ amount: amount.replace(/[^0-9.]/g, '') })
          }
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 4,
            marginTop: 12,
          }}
        >
          <Button
            disabled={!(pubkey && amount)}
            text="Create Channel"
            onPress={() => {}}
          />

          {(!!amount || !!pubkey) && (
            <TouchableOpacity
              style={{}}
              onPress={() => this.setState({ amount: '', pubkey: '' })}
            >
              <Text style={{ color: colors.lightgray, margin: 10 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

export default observer(CreateChannel);
