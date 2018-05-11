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

  init() {
    this._store.invoice.amount = '';
    this._store.invoice.note = '';
    this._nav.goInvoice();
  }

  setAmount({ amount }) {
    this._store.invoice.amount = amount;
  }

  setNote({ note }) {
    this._store.invoice.note = note;
  }

  async generateUri() {
    try {
      const { invoice, settings } = this._store;
      const response = await this._grpc.sendCommand('addInvoice', {
        value: toSatoshis(invoice.amount, settings.unit),
        memo: invoice.note,
      });
      invoice.encoded = response.payment_request;
      invoice.uri = `${PREFIX_URI}${invoice.encoded}`;
      this._nav.goInvoiceQR();
    } catch (err) {
      this._notification.display({ msg: 'Creating invoice failed!', err });
    }
  }

  toClipboard({ text }) {
    this._clipboard.setString(text);
    this._store.displayCopied = true;
  }
}

export default InvoiceAction;
