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
  render() {
    const { computedPayment } = store;

    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Header
          text="Make a Payment"
          description="Lightning payments will be instant, while on-chain Bitcoin transactions require at least one confirmation (approx. 10 mins)"
        />

        <View style={{ height: 30 }} />

        <TextInput
          placeholder="Payment Request / Bitcoin Address"
          value={computedPayment.payment}
          onChangeText={payment => {
            actionsPayments.decodePaymentRequest(payment);
            actionsPayments.setPaymentInfo('payment', payment);
          }}
        />
        <TextInput
          rightText="SAT"
          placeholder="Amount"
          value={computedPayment.amount}
          editable={!computedPayment.isPaymentRequest}
          keyboardType="numeric"
          onChangeText={amount => {
            actionsPayments.setPaymentInfo('amount', amount);
          }}
        />
        {computedPayment.description ? (
          <Text style={{ marginLeft: 5 }}>
            Description: {computedPayment.description}
          </Text>
        ) : null}
        <Button
          disabled={!computedPayment.amount || !computedPayment.payment}
          text="Send Payment"
          onPress={() => {
            actionsPayments
              .makePayment({
                payment: computedPayment.payment,
                amount: computedPayment.amount,
              })
              .then(response => {
                console.log('Send Payment response', response);
              })
              .catch(error => {
                console.log('Error Send Payment', error);
              });
          }}
          showClear={!!computedPayment.amount || !!computedPayment.payment}
          onClear={() => {
            actionsPayments.clearPaymentInfo();
          }}
        />
      </View>
    );
  }
}

export default observer(Pay);
