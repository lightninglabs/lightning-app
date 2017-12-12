import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import { Image, View, TouchableOpacity, TextInput } from 'react-native';
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

    const valid = pubkey && amount;

    return (
      <View style={{ flex: 1, backgroundColor: colors.offwhite, padding: 20 }}>
        <Text style={{ color: colors.gray, fontSize: 24, marginBottom: 14 }}>
          Create Channel
        </Text>
        <Text style={{ color: colors.lightgray }}>
          Channels are like tubes of money used to transfer funds within
          Lightning
        </Text>

        <View
          style={{
            backgroundColor: 'white',
            margin: 4,
            marginTop: 30,
            shadowRadius: 4,
            shadowOpacity: 0.3,
            shadowColor: 'black',
            shadowOffset: { width: 1, height: 1 },
          }}
        >
          <TextInput
            placeholder="Pubkey@HostIP"
            value={pubkey}
            onChangeText={pubkey => this.setState({ pubkey })}
            style={{
              marginLeft: 16,
              fontSize: 18,
              height: 50,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            margin: 4,
            marginTop: 16,
            shadowRadius: 4,
            shadowOpacity: 0.3,
            shadowColor: 'black',
            shadowOffset: { width: 1, height: 1 },
          }}
        >
          <TextInput
            placeholder="Amount"
            value={amount}
            type="number"
            onChangeText={amount =>
              this.setState({ amount: amount.replace(/[^0-9.]/g, '') })
            }
            style={{
              flex: 1,
              marginLeft: 16,
              fontSize: 18,
              height: 50,
            }}
          />
          <View
            style={{
              width: 1,
              backgroundColor: colors.lightergray,
              margin: 8,
              marginRight: 0,
            }}
          />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                color: colors.lightgray,
                marginLeft: 14,
                marginRight: 14,
              }}
            >
              SAT
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 4,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            disabled={!valid}
            style={{
              backgroundColor: !valid ? colors.lightergray : colors.blue,
            }}
            onPress={() => {}}
          >
            <Text style={{ color: 'white', textAlign: 'center', margin: 18 }}>
              Create Channel
            </Text>
          </TouchableOpacity>

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
