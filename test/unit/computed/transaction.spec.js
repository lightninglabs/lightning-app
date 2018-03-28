import { observable, useStrict } from 'mobx';
import ComputedTransaction from '../../../src/computed/transaction';

describe('Computed Transactions Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
  });

  describe('ComputedTransaction()', () => {
    it('should work with empty store', () => {
      store = observable({});
      ComputedTransaction(store);
      expect(store.computedTransactions, 'to equal', null);
    });

    it('should aggregate transactions, payments, and invoices', () => {
      store = observable({
        transactions: [{ date: new Date() }],
        payments: [{ date: new Date() }],
        invoices: [{ date: new Date() }],
      });
      ComputedTransaction(store);
      expect(store.computedTransactions.length, 'to equal', 3);
    });
  });
});
