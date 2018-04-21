import { PREFIX_URI, UNITS } from '../config';

class InvoiceAction {
  constructor(store, grpc, notification) {
    this._store = store;
    this._grpc = grpc;
    this._notification = notification;
  }

  clear() {
    this._store.invoice.amount = '';
    this._store.invoice.note = '';
  }

  setAmount({ amount }) {
    this._store.invoice.amount = amount;
  }

  setNote({ note }) {
    this._store.invoice.note = note;
  }

  async generateUri() {
    try {
      const satoshis = Math.round(
        Number(this._store.invoice.amount) *
          UNITS[this._store.settings.unit].denominator
      );
      const response = await this._grpc.sendCommand('addInvoice', {
        value: satoshis,
        memo: this._store.invoice.note,
      });
      this._store.invoice.encoded = response.payment_request;
      this._store.invoice.uri = `${PREFIX_URI}${this._store.invoice.encoded}`;
    } catch (err) {
      this._notification.display({ msg: 'Creating invoice failed!', err });
    }
  }
}

export default InvoiceAction;
