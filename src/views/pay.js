import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Header from '../components/header';
import TextInput from '../components/textinput';
import Text from '../components/text';
import Button from '../components/button';
import { actionsPayments } from '../actions';
import { View } from 'react-native';
import { colors } from '../styles';
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
    const { paymentRequestResponse } = store;

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
            actionsPayments.decodePaymentRequest(payment);
            this.setState({ payment });
          }}
        />
        <TextInput
          rightText="SAT"
          placeholder="Amount"
          value={paymentRequestResponse.numSatoshis || amount}
          editable={!paymentRequestResponse.numSatoshis}
          onChangeText={amount =>
            this.setState({ amount: amount.replace(/[^0-9.]/g, '') })
          }
        />
        {paymentRequestResponse.description ? (
          <Text style={{ marginLeft: 5 }}>
            Description: {paymentRequestResponse.description}
          </Text>
        ) : null}
        <Button
          disabled={!amount || !payment}
          text="Send Payment"
          onPress={() => {
            actionsPayments
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
