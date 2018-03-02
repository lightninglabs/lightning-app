import { PREFIX_URI } from '../config';
import * as log from './logs';

class ActionsPayments {
  constructor(store, actionsGrpc, actionsWallet) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
    this._actionsWallet = actionsWallet;
  }

  async makePayment({ payment, amount }) {
    try {
      await this.decodePaymentRequest(payment);
    } catch (err) {
      log.info('ActionsPayments makePayment', err);
      this.sendCoins({ addr: payment, amount });
      return;
    }
    await this.payLightning(payment);
  }

  async sendCoins({ addr, amount }) {
    await this._actionsGrpc.sendCommand('sendCoins', {
      addr,
      amount,
    });
    this._actionsWallet.updateBalances();
  }

  async payLightning(payment) {
    payment = payment.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
    const payments = await this._actionsGrpc.sendStreamCommand('sendPayment');
    await new Promise((resolve, reject) => {
      payments.on('data', data => {
        if (data.payment_error === '') {
          resolve();
        } else {
          reject(new Error('Payment route failure'));
        }
      });
      payments.on('error', reject);
      payments.write({ payment_request: payment });
    });
  }

  async decodePaymentRequest(payment) {
    payment = payment.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
    try {
      const request = await this._actionsGrpc.sendCommand('decodePayReq', {
        pay_req: payment,
      });
      this._store.paymentRequestResponse = {
        numSatoshis: request.num_satoshis,
        description: request.description,
      };
    } catch (err) {
      this._store.paymentRequestResponse = {};
      log.error(err);
      throw err;
    }
  }

  setPaymentInfo(key, value) {
    if (['amount', 'payment'].indexOf(key) === -1) {
      return false;
    }
    this._store.paymentInfo[key] = value;
  }

  clearPaymentInfo() {
    this._store.paymentRequestResponse = {};
    this._store.paymentInfo = {
      payment: '',
      amount: '',
    };
  }
}

export default ActionsPayments;
