/**
 * @fileOverview actions to set transactions state within the app and to
 * call the corresponding GRPC apis for listing transactions.
 */

import * as log from './log';
import { parseDate, toHex } from '../helper';

class TransactionAction {
  constructor(store, grpc, nav, notification) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
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
   * @return {Promise<undefined>}
   */
  async select({ item }) {
    this._store.selectedTransaction = item;
    if (item.paymentRequest) {
      item.memo = await this.decodeMemo({ payReq: item.paymentRequest });
    }
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
        id: transaction.txHash,
        type: 'bitcoin',
        amount: transaction.amount,
        fee: transaction.totalFees,
        confirmations: transaction.numConfirmations,
        status: transaction.numConfirmations < 3 ? 'unconfirmed' : 'confirmed',
        date: parseDate(transaction.timeStamp),
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
        id: toHex(invoice.rHash),
        type: 'lightning',
        amount: invoice.value,
        status: invoice.settled ? 'complete' : 'in-progress',
        date: parseDate(invoice.creationDate),
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
        id: payment.paymentHash,
        type: 'lightning',
        amount: -1 * payment.value,
        fee: payment.fee,
        status: 'complete',
        date: parseDate(payment.creationDate),
        preimage: payment.paymentPreimage,
        paymentRequest: payment.paymentRequest,
      }));
    } catch (err) {
      log.error('Listing payments failed', err);
    }
  }

  /**
   * Attempt to decode a lightning payment request using the lnd grpc api.
   * @param  {string} options.payReq  The input to be validated
   * @return {Promise<string>}       If the input is a valid invoice
   */
  async decodeMemo({ payReq }) {
    try {
      const { description } = await this._grpc.sendCommand('decodePayReq', {
        payReq,
      });
      return description;
    } catch (err) {
      log.info(`Decoding payment request failed: ${err.message}`);
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
      stream.on('data', invoice => this._receiveInvoice(invoice));
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Invoices update: ${status}`));
    });
  }

  //
  // Helper functions
  //

  async _receiveInvoice(invoice) {
    await this.update();
    if (!invoice.settled) return;
    const { computedTransactions, unitLabel } = this._store;
    let inv = computedTransactions.find(tx => tx.id === toHex(invoice.rHash));
    this._notification.display({
      type: 'success',
      msg: `Invoice success: received ${inv.amountLabel} ${unitLabel || ''}`,
      handler: () => this.select({ item: inv }),
      handlerLbl: 'View details',
    });
  }
}

export default TransactionAction;
