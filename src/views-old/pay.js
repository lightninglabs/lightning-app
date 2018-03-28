import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Header from '../components-old/header';
import TextInput from '../components-old/textinput';
import Text from '../components-old/text';
import Button from '../components-old/button';
import { payment as paymentAction } from '../action';
import { View } from 'react-native';
import { colors } from '../components-old/styles';
import store from '../store';

class Pay extends Component {
  constructor() {
    super();

    this.state = {
      payment: '',
      amount: '',
    };
  }

  render() {
    const { payment, amount } = this.state;
    const { paymentRequest } = store;

    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Header
          text="Make a Payment"
          description="Lightning payments will be instant, while on-chain Bitcoin transactions require at least one confirmation (approx. 10 mins)"
        />

        <View style={{ height: 30 }} />

        <TextInput
          placeholder="Payment Request / Bitcoin Address"
          value={payment}
          onChangeText={payment => {
            paymentAction.decodePaymentRequest(payment);
            this.setState({ payment });
          }}
        />
        <TextInput
          rightText="SAT"
          placeholder="Amount"
          value={(paymentRequest && paymentRequest.numSatoshis) || amount}
          editable={!paymentRequest}
          onChangeText={amount =>
            this.setState({ amount: amount.replace(/[^0-9.]/g, '') })
          }
        />
        {paymentRequest ? (
          <Text style={{ marginLeft: 5 }}>
            Description: {paymentRequest.description}
          </Text>
        ) : null}
        <Button
          disabled={!amount || !payment}
          text="Send Payment"
          onPress={() => {
            paymentAction
              .makePayment({
                payment,
                amount,
              })
              .then(response => {
                console.log('Send Payment response', response);
              })
              .catch(error => {
                console.log('Error Send Payment', error);
              });
          }}
          showClear={!!amount || !!payment}
          onClear={() => this.setState({ amount: '', payment: '' })}
        />
      </View>
    );
  }
}

export default observer(Pay);
