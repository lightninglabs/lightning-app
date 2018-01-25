import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TextInput from '../components/textinput';
import Button from '../components/button';
import Header from '../components/header';
import { View } from 'react-native';
import { colors } from '../styles';

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
        <Header
          text="Create Channel"
          description="Channels are like tubes of money used to transfer funds within Lightning"
        />

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

        <Button
          disabled={!(pubkey && amount)}
          text="Create Channel"
          onPress={() => {}}
          showClear={!!amount || !!pubkey}
          onClear={() => this.setState({ amount: '', pubkey: '' })}
        />
      </View>
    );
  }
}

export default observer(CreateChannel);
