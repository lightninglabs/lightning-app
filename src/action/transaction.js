import * as log from './log';
import { RETRY_DELAY } from '../config';
import { parseDate, parseSat, toHex, toHash } from '../helper';

class TransactionAction {
  constructor(store, grpc, nav) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
  }

  select({ item }) {
    this._store.selectedTransaction = item;
    this._nav.goTransactionDetail();
  }

  async getTransactions() {
    try {
      const { transactions } = await this._grpc.sendCommand('getTransactions');
      this._store.transactions = transactions.map(transaction => ({
        id: transaction.tx_hash,
        type: 'bitcoin',
        amount: parseSat(transaction.amount),
        fee: parseSat(transaction.total_fees),
        confirmations: parseInt(transaction.num_confirmations, 10),
        status: transaction.num_confirmations < 6 ? 'unconfirmed' : 'confirmed',
        date: parseDate(transaction.time_stamp),
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
        id: toHex(invoice.r_hash),
        type: 'lightning',
        amount: parseSat(invoice.value),
        status: invoice.settled ? 'complete' : 'in-progress',
        date: parseDate(invoice.creation_date),
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
        id: payment.payment_hash,
        type: 'lightning',
        amount: parseSat(payment.value),
        fee: parseSat(payment.fee),
        status: 'complete',
        date: parseDate(payment.creation_date),
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
