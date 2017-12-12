import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import TextInput from '../components/textinput';
import Button from '../components/button';
import {
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import QRCode from '../components/qrcode';
import ComponentIcon from '../components/icon';
import Header from '../components/header';
import Modal from '../components/modal';
import ActionsWallet from '../actions/wallet';
import { colors } from '../styles';
import store from '../store';

class Request extends Component {
  constructor() {
    super();

    this.state = {
      showQR: false,
      showPaymentRequest: false,
      amount: '',
      note: '',
      paymentRequest: null,
    };
  }

  render() {
    const {
      showQR,
      amount,
      note,
      showPaymentRequest,
      paymentRequest,
    } = this.state;
    const { walletAddress } = store;

    return (
      <View style={{ flex: 1, backgroundColor: colors.offwhite }}>
        <View style={{ flex: 1, padding: 20 }}>
          <Header
            text="Request Lightning Payment"
            description="Generate a payment request that others can use to pay you immediately via the Lightning Network"
          />

          <TextInput
            rightText="SAT"
            placeholder="Amount"
            value={amount}
            onChangeText={amount =>
              this.setState({ amount: amount.replace(/[^0-9.]/g, '') })
            }
          />
          <TextInput
            placeholder="Note"
            value={note}
            onChangeText={note => this.setState({ note })}
          />
          <Button
            disabled={!amount}
            text="Generate Payment Request"
            onPress={() => {
              this.setState({ paymentRequest: null, showPaymentRequest: true });
              ActionsWallet.generatePaymentRequest(amount, note)
                .then(paymentRequest => {
                  this.setState({ paymentRequest });
                })
                .catch(err => {
                  // TODO: Show error
                });
            }}
            showClear={!!amount || !!note}
            onClear={() => this.setState({ amount: '', note: '' })}
          />

          <View
            style={{
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: colors.lightergray,
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: 'white',
                padding: 14,
                margin: 4,
                marginTop: 20,
                shadowRadius: 4,
                shadowOpacity: 0.3,
                shadowColor: 'black',
                shadowOffset: { width: 1, height: 1 },
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: colors.gray,
                  userSelect: 'none',
                  cursor: 'default',
                }}
              >
                Wallet Address
              </Text>
              <View
                style={{
                  width: 1,
                  marginLeft: 10,
                  marginRight: 10,
                  backgroundColor: colors.lightergray,
                }}
              />
              {walletAddress ? (
                <Text style={{ fontSize: 15 }}>{walletAddress}</Text>
              ) : (
                <ActivityIndicator />
              )}
            </View>

            {walletAddress && (
              <TouchableOpacity
                style={{}}
                onPress={() => this.setState({ showQR: true })}
              >
                <ComponentIcon
                  icon="qrcode"
                  style={{
                    margin: 10,
                    marginTop: 22,
                    width: 28,
                    height: 28,
                    color: colors.gray,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Modal show={showQR} onPress={() => this.setState({ showQR: false })}>
          <View style={{ width: 300, height: 300, backgroundColor: 'white' }}>
            <QRCode address={walletAddress} />
          </View>
        </Modal>

        <Modal
          show={showPaymentRequest}
          onPress={() => this.setState({ showPaymentRequest: false })}
        >
          <View style={{ padding: 20, backgroundColor: 'white' }}>
            {paymentRequest ? (
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(paymentRequest);
                }}
              >
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                  Payment Request
                </Text>
                <Text style={{ color: colors.lightgray }}>
                  Send this encoded payment request to the party who would like
                  to pay you via the Lightning Network.
                </Text>
                <TextInput
                  editable={false}
                  value={paymentRequest}
                  rightText="Copy"
                />
              </TouchableOpacity>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

export default observer(Request);
