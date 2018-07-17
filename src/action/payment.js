import { PREFIX_URI } from '../config';
import {
  toSatoshis,
  toAmount,
  parseSat,
  isLnUri,
  isAddress,
  nap,
} from '../helper';
import * as log from './log';

class PaymentAction {
  constructor(store, grpc, transaction, nav, notification) {
    this._store = store;
    this._grpc = grpc;
    this._transaction = transaction;
    this._nav = nav;
    this._notification = notification;
  }

  listenForUrl(ipcRenderer) {
    ipcRenderer.on('open-url', async (event, url) => {
      log.info('open-url', url);
      if (!isLnUri(url)) {
        return;
      }
      while (!this._store.lndReady) {
        this._tOpenUri = await nap(100);
      }
      this.init();
      this.setAddress({ address: url.replace(PREFIX_URI, '') });
      this.checkType();
    });
  }

  init() {
    this._store.payment.address = '';
    this._store.payment.amount = '';
    this._store.payment.fee = '';
    this._store.payment.note = '';
    this._nav.goPay();
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
    } else if (isAddress(this._store.payment.address)) {
      this._nav.goPayBitcoin();
    } else {
      this._notification.display({ msg: 'Invalid invoice or address' });
    }
  }

  async decodeInvoice({ invoice }) {
    try {
      const { payment, settings } = this._store;
      const request = await this._grpc.sendCommand('decodePayReq', {
        pay_req: invoice.replace(PREFIX_URI, ''),
      });
      const fee = await this.estimateLightningFee({
        destination: request.destination,
        satAmt: request.num_satoshis,
      });
      payment.amount = toAmount(parseSat(request.num_satoshis), settings.unit);
      payment.note = request.description;
      payment.fee = toAmount(parseSat(fee), settings.unit);
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
      this._nav.goPayBitcoinDone();
    } catch (err) {
      this._notification.display({ msg: 'Sending transaction failed!', err });
    }
    await this._transaction.update();
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
        this._nav.goWait();
      });
      this._nav.goPayLightningDone();
    } catch (err) {
      this._nav.goPayLightningConfirm();
      this._notification.display({ msg: 'Lightning payment failed!', err });
    }
    await this._transaction.update();
  }

  async estimateLightningFee({ destination, satAmt }) {
    try {
      const { routes } = await this._grpc.sendCommand('queryRoutes', {
        pub_key: destination,
        amt: satAmt,
        num_routes: 1,
      });
      return routes[0].total_fees;
    } catch (err) {
      log.info(`Unable to retrieve fee estimate: ${JSON.stringify(err)}`);
      return 0;
    }
  }
}

export default PaymentAction;
