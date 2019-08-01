/**
 * @fileOverview actions to set payment state within the app and to
 * call the corresponding GRPC apis for payment management.
 */

import {
  PREFIX_REGEX,
  PAYMENT_TIMEOUT,
  POLL_STORE_TIMEOUT,
  SEND_TARGET_CONF,
} from '../config';
import { toSatoshis, toAmount, isLnUri, isAddress, nap } from '../helper';
import * as log from './log';

class PaymentAction {
  constructor(store, grpc, nav, notification, clipboard) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
    this._clipboard = clipboard;
  }

  /**
   * Set the listener for IPC from the main electron process to
   * handle incoming URIs containing lightning invoices.
   * @param  {Object} ipcRenderer Electron's IPC api for the rendering process
   * @return {undefined}
   */
  listenForUrl(ipc) {
    ipc.listen('open-url', (event, url) => this._openUrl(url));
  }

  /**
   * Set the listener for the mobile app to handle incoming URIs
   * containing lightning invoices.
   * @param  {Object} Linking The expo api to handle incoming uris
   * @return {undefined}
   */
  async listenForUrlMobile(Linking) {
    Linking.addEventListener('url', ({ url }) => this._openUrl(url));
    const url = await Linking.getInitialURL();
    if (!url) {
      return;
    }
    while (!this._store.navReady) {
      await nap(POLL_STORE_TIMEOUT);
    }
    while (!this._store.syncedToChain) {
      await nap(POLL_STORE_TIMEOUT);
    }
    await this._openUrl(url);
  }

  async _openUrl(url) {
    log.info('open-url', url);
    if (!isLnUri(url)) {
      return;
    }
    while (!this._store.lndReady) {
      await nap(POLL_STORE_TIMEOUT);
    }
    this.init();
    this.setAddress({ address: url });
    this.checkType();
  }

  /**
   * Read data from the QR code scanner, set it as the address and
   * check which type of invoice it is.
   * @param  {string} options.data The data containing the scanned invoice
   * @return {undefined}
   */
  readQRCode({ data }) {
    if (!data) {
      return;
    }
    this.setAddress({ address: data });
    this.checkType();
  }

  /**
   * Toggle between address input field and the QR code scanner.
   * @return {undefined}
   */
  toggleScanner() {
    this._store.payment.useScanner = !this._store.payment.useScanner;
  }

  /**
   * Paste the contents of the clipboard into the address input
   * and then check which type of invoice it is.
   * @return {Promise<undefined>}
   */
  async pasteAddress() {
    this.setAddress({ address: await this._clipboard.getString() });
    await this.checkType();
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
    this._store.payment.useScanner = false;
    this._store.payment.sendAll = false;
    this._nav.goPay();
  }

  /**
   * Set the address input for the payment view. This can either be
   * an on-chain bitcoin addres or an encoded lightning invoice.
   * @param {string} options.address The payment address
   */
  setAddress({ address }) {
    this._store.payment.address = address.replace(PREFIX_REGEX, '');
  }

  /**
   * Set the amount input for the payment view. This amount
   * is either in btc or fiat depending on user settings.
   * @param {string} options.amount The string formatted number
   */
  setAmount({ amount }) {
    this._store.payment.amount = amount;
    this._store.payment.sendAll = false;
  }

  /**
   * Set the payment amount to the max amount that can be sent. This
   * is useful for people to move their coins off of the app.
   * @return {Promise<undefined>}
   */
  async toggleMax() {
    const { payment, balanceSatoshis, settings } = this._store;
    if (payment.sendAll) {
      return this.setAmount({ amount: '0' });
    }
    let amtSat = Math.floor(0.8 * balanceSatoshis);
    payment.amount = toAmount(amtSat, settings, 2);
    await this.estimateFee();
    amtSat = balanceSatoshis - toSatoshis(payment.fee, settings);
    payment.amount = toAmount(amtSat, settings, 2);
    payment.sendAll = true;
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
        payReq: invoice,
      });
      payment.amount = toAmount(request.numSatoshis, settings);
      payment.note = request.description;
      this.estimateLightningFee({
        destination: request.destination,
        satAmt: request.numSatoshis,
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
        pubKey: destination,
        amt: satAmt,
        numRoutes: 1,
      });
      payment.fee = toAmount(routes[0].totalFees, settings);
    } catch (err) {
      log.info(`Estimating lightning fee failed!`, err);
    }
  }

  /**
   * Estimate the on-chain transaction fee using the grpc api after which
   * the fee is set in the store.
   * @return {Promise<undefined>}
   */
  async estimateFee() {
    const { payment, settings } = this._store;
    const AddrToAmount = {};
    AddrToAmount[payment.address] = toSatoshis(payment.amount, settings);
    const { feeSat } = await this._grpc.sendCommand('estimateFee', {
      AddrToAmount,
      targetConf: SEND_TARGET_CONF,
    });
    payment.fee = toAmount(feeSat, settings);
  }

  /**
   * Initialize the pay bitcoin confirm view by getting a fee estimate
   * from lnd and navigating to the view.
   * @return {Promise<undefined>}
   */
  async initPayBitcoinConfirm() {
    try {
      const { payment } = this._store;
      if (!payment.fee || !payment.sendAll) {
        await this.estimateFee();
      }
      this._nav.goPayBitcoinConfirm();
    } catch (err) {
      this._notification.display({
        msg: `Fee estimation failed: ${err.details}`,
        err,
      });
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
    const timeout = setTimeout(() => {
      this._nav.goPayBitcoinConfirm();
      this._notification.display({
        type: 'error',
        msg: 'Sending transaction timed out!',
      });
    }, PAYMENT_TIMEOUT);
    this._nav.goWait();
    try {
      await this._sendPayment();
      this._nav.goPayBitcoinDone();
    } catch (err) {
      this._nav.goPayBitcoinConfirm();
      this._notification.display({ msg: 'Sending transaction failed!', err });
    } finally {
      clearTimeout(timeout);
    }
  }

  async _sendPayment() {
    const { payment, settings } = this._store;
    let amount = payment.sendAll ? 0 : toSatoshis(payment.amount, settings);
    await this._grpc.sendCommand('sendCoins', {
      addr: payment.address,
      amount,
      targetConf: SEND_TARGET_CONF,
      sendAll: payment.sendAll,
    });
  }

  /**
   * Send the amount specified in the invoice as a lightning transaction and
   * display the wait screen while the payment confirms.
   * This action can be called from a view event handler as does all
   * the necessary error handling and notification display.
   * @return {Promise<undefined>}
   */
  async payLightning() {
    let failed = false;
    const timeout = setTimeout(() => {
      failed = true;
      this._nav.goPaymentFailed();
    }, PAYMENT_TIMEOUT);
    try {
      this._nav.goWait();
      const invoice = this._store.payment.address;
      const stream = this._grpc.sendStreamCommand('sendPayment');
      await new Promise((resolve, reject) => {
        stream.on('data', data => {
          if (data.paymentError) {
            reject(new Error(`Lightning payment error: ${data.paymentError}`));
          } else {
            resolve();
          }
        });
        stream.on('error', reject);
        stream.write(JSON.stringify({ paymentRequest: invoice }), 'utf8');
      });
      if (failed) return;
      this._nav.goPayLightningDone();
    } catch (err) {
      if (failed) return;
      this._nav.goPayLightningConfirm();
      this._notification.display({ msg: 'Lightning payment failed!', err });
    } finally {
      clearTimeout(timeout);
    }
  }
}

export default PaymentAction;
