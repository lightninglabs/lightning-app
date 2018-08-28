/**
 * @fileOverview actions to set transactions state within the app and to
 * call the corresponding GRPC apis for listing transactions.
 */

import * as log from './log';
import { parseDate, parseSat, toHex } from '../helper';

class TransactionAction {
  constructor(store, grpc, nav) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
  }

  /**
   * Initiate the transaction list view by navigating to the view and updating
   * the app's transaction state by calling all necessary grpc apis.
   * @return {undefined}
   */
  init() {
    this._nav.goTransactions();
    this.update();
  }

  /**
   * Select a transaction item from the transaction list view and then navigate
   * to the detail view to list transaction parameters.
   * @param  {Object} options.item The selected transaction object
   * @return {undefined}
   */
  select({ item }) {
    this._store.selectedTransaction = item;
    this._nav.goTransactionDetail();
    this.update();
  }

  /**
   * Update the on-chain transactions, invoice, and lighting payments in the
   * app state by querying all required grpc apis.
   * @return {Promise<undefined>}
   */
  async update() {
    await Promise.all([
      this.getTransactions(),
      this.getInvoices(),
      this.getPayments(),
    ]);
  }

  /**
   * List the on-chain transactions by calling the respective grpc api and updating
   * the transactions array in the global store.
   * @return {Promise<undefined>}
   */
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
      }));
    } catch (err) {
      log.error('Listing transactions failed', err);
    }
  }

  /**
   * List the lightning invoices by calling the respective grpc api and updating
   * the invoices array in the global store.
   * @return {Promise<undefined>}
   */
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
      }));
    } catch (err) {
      log.error('Listing invoices failed', err);
    }
  }

  /**
   * List the lightning payments by calling the respective grpc api and updating
   * the payments array in the global store.
   * @return {Promise<undefined>}
   */
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
      }));
    } catch (err) {
      log.error('Listing payments failed', err);
    }
  }

  /**
   * Subscribe to incoming on-chain transactions using the grpc streaming api.
   * @return {Promise<undefined>}
   */
  async subscribeTransactions() {
    const stream = this._grpc.sendStreamCommand('subscribeTransactions');
    await new Promise((resolve, reject) => {
      stream.on('data', () => this.update());
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Transactions update: ${status}`));
    });
  }

  /**
   * Subscribe to incoming invoice payments using the grpc streaming api.
   * @return {Promise<undefined>}
   */
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
