import { PREFIX_URI } from '../config';
import { toSatoshis, toAmount } from '../helper';
import * as log from './log';

class PaymentAction {
  constructor(store, grpc, wallet, nav, notification) {
    this._store = store;
    this._grpc = grpc;
    this._wallet = wallet;
    this._nav = nav;
    this._notification = notification;
  }

  clear() {
    this._store.payment.address = '';
    this._store.payment.amount = '';
    this._store.payment.fee = '';
    this._store.payment.note = '';
  }

  setAddress({ address }) {
    this._store.payment.address = address;
  }

  setAmount({ amount }) {
    this._store.payment.amount = amount;
  }

  async checkType() {
    if (!this._store.payment.address) {
      return this._notification.display({ msg: 'Enter an invoice or address' });
    }
    if (await this.decodeInvoice({ invoice: this._store.payment.address })) {
      this._nav.goPayLightningConfirm();
    } else {
      this._nav.goPayBitcoin();
    }
  }

  async decodeInvoice({ invoice }) {
    try {
      const { payment, settings } = this._store;
      const request = await this._grpc.sendCommand('decodePayReq', {
        pay_req: invoice.replace(PREFIX_URI, ''),
      });
      payment.amount = toAmount(request.num_satoshis, settings.unit);
      payment.note = request.description;
      return true;
    } catch (err) {
      log.info(`Decoding payment request failed: ${err.message}`);
      return false;
    }
  }

  async payBitcoin() {
    try {
      const { payment, settings } = this._store;
      await this._grpc.sendCommand('sendCoins', {
        addr: payment.address,
        amount: toSatoshis(payment.amount, settings.unit),
      });
      this._nav.goHome();
    } catch (err) {
      this._notification.display({ msg: 'Sending transaction failed!', err });
    }
    await this._wallet.getBalance();
  }

  async payLightning() {
    try {
      const invoice = this._store.payment.address.replace(PREFIX_URI, '');
      const stream = this._grpc.sendStreamCommand('sendPayment');
      await new Promise((resolve, reject) => {
        stream.on('data', data => {
          if (data.payment_error) {
            reject(new Error(`Lightning payment error: ${data.payment_error}`));
          } else {
            resolve();
          }
        });
        stream.on('error', reject);
        stream.write(JSON.stringify({ payment_request: invoice }), 'utf8');
      });
      this._nav.goHome();
    } catch (err) {
      this._notification.display({ msg: 'Lightning payment failed!', err });
    }
    await this._wallet.getChannelBalance();
  }
}

export default PaymentAction;
