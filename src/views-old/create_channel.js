import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TextInput from '../components-old/textinput';
import Button from '../components-old/button';
import Header from '../components-old/header';
import { channel } from '../action';
import { View } from 'react-native';
import { colors } from '../styles';

class CreateChannel extends Component {
  constructor() {
    super();

    this.state = {
      pubkeyAtHost: '',
      amount: '',
    };
  }

  render() {
    const { pubkeyAtHost, amount } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: colors.offwhite, padding: 20 }}>
        <Header
          text="Create Channel"
          description="Channels are like tubes of money used to transfer funds within Lightning"
        />

        <TextInput
          placeholder="Pubkey@HostIP"
          value={pubkeyAtHost}
          onChangeText={pubkeyAtHost => this.setState({ pubkeyAtHost })}
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
          disabled={!(pubkeyAtHost && amount)}
          text="Create Channel"
          onPress={() => channel.connectAndOpen({ pubkeyAtHost, amount })}
          showClear={!!amount || !!pubkeyAtHost}
          onClear={() => this.setState({ amount: '', pubkeyAtHost: '' })}
        />
      </View>
    );
  }
}

export default observer(CreateChannel);
