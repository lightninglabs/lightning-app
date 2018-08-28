/**
 * @fileOverview actions to set payment state within the app and to
 * call the corresponding GRPC apis for payment management.
 */

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
  constructor(store, grpc, nav, notification) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
  }

  /**
   * Set the listener for IPC from the main electron process to
   * handle incoming URIs containing lightning invoices.
   * @param  {Object} ipcRenderer Electron's IPC api for the rendering process
   * @return {undefined}
   */
  listenForUrl(ipc) {
    ipc.listen('open-url', async (event, url) => {
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

  /**
   * Initialize the payment view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  init() {
    this._store.payment.address = '';
    this._store.payment.amount = '';
    this._store.payment.fee = '';
    this._store.payment.note = '';
    this._nav.goPay();
  }

  /**
   * Set the address input for the payment view. This can either be
   * an on-chain bitcoin addres or an encoded lightning invoice.
   * @param {string} options.address The payment address
   */
  setAddress({ address }) {
    this._store.payment.address = address;
  }

  /**
   * Set the amount input for the payment view. This amount
   * is either in btc or fiat depending on user settings.
   * @param {string} options.amount The string formatted number
   */
  setAmount({ amount }) {
    this._store.payment.amount = amount;
  }

  /**
   * Check if the address input provided by the user is either an on-chain
   * bitcoin address or a lightning invoice. Depending on which type it is
   * the app will navigate to the corresponding payment view.
   * This action can be called from a view event handler as does all
   * the necessary error handling and notification display.
   * @return {Promise<undefined>}
   */
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

  /**
   * Attempt to decode a lightning invoice using the lnd grpc api. If it is
   * an invoice the amount and note store values will be set and the lightning
   * transaction fee will also be estimated.
   * @param  {string} options.invoice The input to be validated
   * @return {Promise<boolean>}       If the input is a valid invoice
   */
  async decodeInvoice({ invoice }) {
    try {
      const { payment, settings } = this._store;
      const request = await this._grpc.sendCommand('decodePayReq', {
        pay_req: invoice.replace(PREFIX_URI, ''),
      });
      payment.amount = toAmount(parseSat(request.num_satoshis), settings);
      payment.note = request.description;
      await this.estimateLightningFee({
        destination: request.destination,
        satAmt: parseSat(request.num_satoshis),
      });
      return true;
    } catch (err) {
      log.info(`Decoding payment request failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Estimate the lightning transaction fee using the queryRoutes grpc api
   * after which the fee is set in the store.
   * @param  {string} options.destination The lnd node that is to be payed
   * @param  {number} options.satAmt      The amount to be payed in satoshis
   * @return {Promise<undefined>}
   */
  async estimateLightningFee({ destination, satAmt }) {
    try {
      const { payment, settings } = this._store;
      const { routes } = await this._grpc.sendCommand('queryRoutes', {
        pub_key: destination,
        amt: satAmt,
        num_routes: 1,
      });
      payment.fee = toAmount(parseSat(routes[0].total_fees), settings);
    } catch (err) {
      log.error(`Estimating lightning fee failed!`, err);
    }
  }

  /**
   * Send the specified amount as an on-chain transaction to the provided
   * bitcoin address and display a payment confirmation screen.
   * This action can be called from a view event handler as does all
   * the necessary error handling and notification display.
   * @return {Promise<undefined>}
   */
  async payBitcoin() {
    try {
      const { payment, settings } = this._store;
      await this._grpc.sendCommand('sendCoins', {
        addr: payment.address,
        amount: toSatoshis(payment.amount, settings),
      });
      this._nav.goPayBitcoinDone();
    } catch (err) {
      this._notification.display({ msg: 'Sending transaction failed!', err });
    }
  }

  /**
   * Send the amount specified in the invoice as a lightning transaction and
   * display the wait screen while the payment confirms.
   * This action can be called from a view event handler as does all
   * the necessary error handling and notification display.
   * @return {Promise<undefined>}
   */
  async payLightning() {
    try {
      this._nav.goWait();
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
      this._nav.goPayLightningDone();
    } catch (err) {
      this._nav.goPayLightningConfirm();
      this._notification.display({ msg: 'Lightning payment failed!', err });
    }
  }
}

export default PaymentAction;
