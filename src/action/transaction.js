import * as log from './log';
import { parseDate, parseSat, toHex, toHash } from '../helper';

class TransactionAction {
  constructor(store, grpc, wallet, nav) {
    this._store = store;
    this._grpc = grpc;
    this._wallet = wallet;
    this._nav = nav;
  }

  async init() {
    this._nav.goTransactions();
    await this.update();
  }

  async select({ item }) {
    this._store.selectedTransaction = item;
    this._nav.goTransactionDetail();
    await this.update();
  }

  async update() {
    await Promise.all([
      this.getTransactions(),
      this.getInvoices(),
      this.getPayments(),
      this._wallet.getBalance(),
      this._wallet.getChannelBalance(),
    ]);
  }

  async getTransactions() {
    try {
      const { transactions } = await this._grpc.sendCommand('getTransactions');
      this._store.transactions = transactions.map(transaction => ({
        id: transaction.tx_hash,
        type: 'bitcoin',
        amount: parseSat(transaction.amount),
        fee: parseSat(transaction.total_fees),
        confirmations: transaction.num_confirmations,
        status: transaction.num_confirmations < 6 ? 'unconfirmed' : 'confirmed',
        date: parseDate(transaction.time_stamp),
        hash: transaction.tx_hash,
      }));
    } catch (err) {
      log.error('Listing transactions failed', err);
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
      log.error('Listing invoices failed', err);
    }
  }

  async getPayments() {
    try {
      const { payments } = await this._grpc.sendCommand('listPayments');
      this._store.payments = payments.map(payment => ({
        id: payment.payment_hash,
        type: 'lightning',
        amount: -1 * parseSat(payment.value),
        fee: parseSat(payment.fee),
        status: 'complete',
        date: parseDate(payment.creation_date),
        hash: payment.payment_hash,
      }));
    } catch (err) {
      log.error('Listing payments failed', err);
    }
  }

  async subscribeTransactions() {
    const stream = this._grpc.sendStreamCommand('subscribeTransactions');
    await new Promise((resolve, reject) => {
      stream.on('data', () => this.update());
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Transactions update: ${status}`));
    });
  }

  async subscribeInvoices() {
    const stream = this._grpc.sendStreamCommand('subscribeInvoices');
    await new Promise((resolve, reject) => {
      stream.on('data', () => this.update());
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Invoices update: ${status}`));
    });
  }
}

export default TransactionAction;
