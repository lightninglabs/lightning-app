/**
 * @fileOverview actions required to generate a lightning payment request
 * a.k.a invoice that can be sent to another user.
 */

import { PREFIX_URI } from '../config';
import { toSatoshis } from '../helper';

class InvoiceAction {
  constructor(store, grpc, nav, notification, clipboard) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
    this._clipboard = clipboard;
  }

  /**
   * Initialize the invoice view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  init() {
    this._store.invoice.amount = '';
    this._store.invoice.note = '';
    this._store.invoice.encoded = '';
    this._store.invoice.uri = '';
    this._nav.goInvoice();
  }

  /**
   * Set the amount input for the invoice view. This amount
   * is either in btc or fiat depending on user settings.
   * @param {string} options.amount The string formatted number
   */
  setAmount({ amount }) {
    this._store.invoice.amount = amount;
  }

  /**
   * Set the node input for the invoice view. This is used as
   * the description in the invoice later viewed by the payer.
   * @param {string} options.note The invoice description
   */
  setNote({ note }) {
    this._store.invoice.note = note;
  }

  /**
   * Read the input values amount and note and generates an encoded
   * payment request via the gprc api. The invoice uri is also set
   * which can be rendered in a QR code for scanning. After the values
   * are set on the store the user is navigated to the invoice QR view
   * which displays the QR for consumption by the payer.
   * This action can be called from a view event handler as does all
   * the necessary error handling and notification display.
   * @return {Promise<undefined>}
   */
  async generateUri() {
    try {
      const { invoice, settings } = this._store;
      const response = await this._grpc.sendCommand('addInvoice', {
        value: toSatoshis(invoice.amount, settings),
        memo: invoice.note,
      });
      invoice.encoded = response.payment_request;
      invoice.uri = `${PREFIX_URI}${invoice.encoded}`;
      this._nav.goInvoiceQR();
    } catch (err) {
      this._notification.display({ msg: 'Creating invoice failed!', err });
    }
  }

  /**
   * A simple wrapper around the react native clipboard api. This can
   * be called when a string like a payment request or address should be
   * copied and pasted from the application UI.
   * @param  {string} options.text The payload to be copied to the clipboard
   * @return {undefined}
   */
  toClipboard({ text }) {
    this._clipboard.setString(text);
    this._store.displayCopied = true;
  }
}

export default InvoiceAction;
