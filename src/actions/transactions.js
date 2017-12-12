import { observe } from 'mobx';
import store from '../store';
import ActionsGrpc from './grpc';
import { toHash } from '../helpers';
import { RETRY_DELAY } from '../config';

class ActionsTransactions {
  constructor() {
    observe(store, 'lndReady', () => {
      this.getTransactions();
      this.getInvoices();
      this.getPayments();

      // this.subscribeTransactions();
      // this.subscribeInvoices();
    });
  }

  getTransactions() {
    ActionsGrpc.sendCommand('getTransactions')
      .then(response => {
        store.transactionsResponse = response.transactions.map(transaction => ({
          id: transaction.tx_hash,
          type: 'bitcoin',
          amount: transaction.amount,
          status:
            transaction.num_confirmations < 1 ? 'unconfirmed' : 'confirmed',
          date: new Date(parseInt(transaction.time_stamp, 10)),
          hash: transaction.tx_hash,
        }));
      })
      .catch(() => {
        clearTimeout(this.tgetTransactions);
        this.tgetTransactions = setTimeout(
          () => this.getTransactions(),
          RETRY_DELAY
        );
      });
  }

  getInvoices() {
    ActionsGrpc.sendCommand('listInvoices')
      .then(response => {
        store.invoicesResponse = response.invoices.map(invoice => ({
          id: invoice.creation_date,
          type: 'lightning',
          amount: invoice.value,
          status: invoice.settled ? 'complete' : 'in-progress',
          date: new Date(parseInt(invoice.creation_date, 10)),
          memo: invoice.memo,
          hash: toHash(invoice.r_preimage),
        }));
      })
      .catch(() => {
        clearTimeout(this.tgetInvoices);
        this.tgetInvoices = setTimeout(() => this.getInvoices(), RETRY_DELAY);
      });
  }

  getPayments() {
    ActionsGrpc.sendCommand('listPayments')
      .then(response => {
        store.paymentsResponse = response.payments.map(payment => ({
          id: payment.creation_date,
          type: 'lightning',
          amount: payment.value,
          status: 'complete',
          date: new Date(parseInt(payment.creation_date, 10)),
          hash: payment.payment_hash,
        }));
      })
      .catch(() => {
        clearTimeout(this.tgetPayments);
        this.tgetPayments = setTimeout(() => this.getPayments(), RETRY_DELAY);
      });
  }

  subscribeTransactions() {
    ActionsGrpc.sendStreamCommand('subscribeTransactions')
      .then(response => {})
      .catch(() => {
        clearTimeout(this.tsubscribeTransactions);
        this.tsubscribeTransactions = setTimeout(
          () => this.subscribeTransactions(),
          RETRY_DELAY
        );
      });
  }

  subscribeInvoices() {
    ActionsGrpc.sendStreamCommand('subscribeInvoices')
      .then(response => {})
      .catch(() => {
        clearTimeout(this.tsubscribeInvoices);
        this.tsubscribeInvoices = setTimeout(
          () => this.subscribeInvoices(),
          RETRY_DELAY
        );
      });
  }
}

export default new ActionsTransactions();
