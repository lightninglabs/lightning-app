import { toHash } from '../helpers';
import { RETRY_DELAY } from '../config';

class ActionsTransactions {
  constructor(store, actionsGrpc) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
  }

  async getTransactions() {
    try {
      const { transactions } = await this._actionsGrpc.sendCommand(
        'getTransactions'
      );
      this._store.transactionsResponse = transactions.map(transaction => ({
        id: transaction.tx_hash,
        type: 'bitcoin',
        amount: transaction.amount,
        status: transaction.num_confirmations < 1 ? 'unconfirmed' : 'confirmed',
        date: new Date(parseInt(transaction.time_stamp, 10)),
        hash: transaction.tx_hash,
      }));
    } catch (err) {
      clearTimeout(this.tgetTransactions);
      this.tgetTransactions = setTimeout(
        () => this.getTransactions(),
        RETRY_DELAY
      );
    }
  }

  async getInvoices() {
    try {
      const { invoices } = await this._actionsGrpc.sendCommand('listInvoices');
      this._store.invoicesResponse = invoices.map(invoice => ({
        id: invoice.creation_date,
        type: 'lightning',
        amount: invoice.value,
        status: invoice.settled ? 'complete' : 'in-progress',
        date: new Date(parseInt(invoice.creation_date, 10)),
        memo: invoice.memo,
        hash: toHash(invoice.r_preimage),
      }));
    } catch (err) {
      clearTimeout(this.tgetInvoices);
      this.tgetInvoices = setTimeout(() => this.getInvoices(), RETRY_DELAY);
    }
  }

  async getPayments() {
    try {
      const { payments } = await this._actionsGrpc.sendCommand('listPayments');
      this._store.paymentsResponse = payments.map(payment => ({
        id: payment.creation_date,
        type: 'lightning',
        amount: payment.value,
        status: 'complete',
        date: new Date(parseInt(payment.creation_date, 10)),
        hash: payment.payment_hash,
      }));
    } catch (err) {
      clearTimeout(this.tgetPayments);
      this.tgetPayments = setTimeout(() => this.getPayments(), RETRY_DELAY);
    }
  }

  async subscribeTransactions() {
    try {
      await this._actionsGrpc.sendStreamCommand('subscribeTransactions');
    } catch (err) {
      clearTimeout(this.tsubscribeTransactions);
      this.tsubscribeTransactions = setTimeout(
        () => this.subscribeTransactions(),
        RETRY_DELAY
      );
    }
  }

  async subscribeInvoices() {
    try {
      await this._actionsGrpc.sendStreamCommand('subscribeInvoices');
    } catch (err) {
      clearTimeout(this.tsubscribeInvoices);
      this.tsubscribeInvoices = setTimeout(
        () => this.subscribeInvoices(),
        RETRY_DELAY
      );
    }
  }
}

export default ActionsTransactions;
