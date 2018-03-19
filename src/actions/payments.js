import { PREFIX_URI } from '../config';
import * as log from './logs';

class ActionsPayments {
  constructor(store, actionsGrpc, actionsWallet, notification) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
    this._actionsWallet = actionsWallet;
    this._notification = notification;
  }

  async sendCoins({ address, amount }) {
    try {
      await this._actionsGrpc.sendCommand('sendCoins', {
        addr: address,
        amount,
      });
    } catch (err) {
      this._notification.display({ msg: 'Sending transaction failed!', err });
    }
    await this._actionsWallet.getBalance();
  }

  async payLightning({ payment }) {
    try {
      payment = payment.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
      const stream = this._actionsGrpc.sendStreamCommand('sendPayment');
      await new Promise((resolve, reject) => {
        stream.on('data', data => {
          if (data.payment_error) {
            reject(new Error(`Lightning payment error: ${data.payment_error}`));
          } else {
            resolve();
          }
        });
        stream.on('error', reject);
        stream.write(JSON.stringify({ payment_request: payment }), 'utf8');
      });
    } catch (err) {
      this._notification.display({ msg: 'Lightning payment failed!', err });
    }
    await this._actionsWallet.getChannelBalance();
  }

  async decodePaymentRequest({ payment }) {
    payment = payment.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
    try {
      const request = await this._actionsGrpc.sendCommand('decodePayReq', {
        pay_req: payment,
      });
      this._store.paymentRequest = {
        numSatoshis: request.num_satoshis,
        description: request.description,
      };
    } catch (err) {
      this._store.paymentRequest = null;
      log.error(err);
    }
  }
}

export default ActionsPayments;
