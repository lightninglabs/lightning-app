import { PREFIX_URI } from '../config';
import * as log from './log';
import { formatNumber } from '../helper';
import { UNITS } from '../config';

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
    this._store.payment.note = '';
  }

  setAddress({ address }) {
    this._store.payment.address = address;
  }

  async checkType() {
    if (!this._store.payment.address) {
      return this._notification.display({ msg: 'Enter an invoice or address' });
    }
    if (await this.decodeInvoice({ invoice: this._store.payment.address })) {
      this._nav.goPayLighting();
    } else {
      this._nav.goPayBitcoin();
    }
  }

  async decodeInvoice({ invoice }) {
    invoice = invoice.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
    try {
      const request = await this._grpc.sendCommand('decodePayReq', {
        pay_req: invoice,
      });
      const satoshis = Number(request.num_satoshis);
      const denominator = UNITS[this._store.settings.unit].denominator;
      this._store.payment.amount = formatNumber(satoshis / denominator);
      this._store.payment.note = request.description;
      return true;
    } catch (err) {
      log.info(`Decoding payment request failed: ${err.message}`);
      return false;
    }
  }

  async sendCoins({ address, amount }) {
    try {
      await this._grpc.sendCommand('sendCoins', {
        addr: address,
        amount,
      });
    } catch (err) {
      this._notification.display({ msg: 'Sending transaction failed!', err });
    }
    await this._wallet.getBalance();
  }

  async payLightning({ invoice }) {
    try {
      invoice = invoice.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
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
    } catch (err) {
      this._notification.display({ msg: 'Lightning payment failed!', err });
    }
    await this._wallet.getChannelBalance();
  }
}

export default PaymentAction;
