import * as log from './logs';
import { toHash } from '../helpers';
import { RETRY_DELAY } from '../config';

class TransactionAction {
  constructor(store, grpc) {
    this._store = store;
    this._grpc = grpc;
  }

  async getTransactions() {
    try {
      const { transactions } = await this._grpc.sendCommand('getTransactions');
      this._store.transactions = transactions.map(transaction => ({
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
      const { invoices } = await this._grpc.sendCommand('listInvoices');
      this._store.invoices = invoices.map(invoice => ({
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
      const { payments } = await this._grpc.sendCommand('listPayments');
      this._store.payments = payments.map(payment => ({
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
    const stream = this._grpc.sendStreamCommand('subscribeTransactions');
    await new Promise((resolve, reject) => {
      stream.on('data', () => this.getTransactions());
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Transactions update: ${status}`));
    });
  }

  async subscribeInvoices() {
    const stream = this._grpc.sendStreamCommand('subscribeInvoices');
    await new Promise((resolve, reject) => {
      stream.on('data', () => this.getInvoices());
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Invoices update: ${status}`));
    });
  }
}

export default TransactionAction;
