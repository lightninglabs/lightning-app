import { Store } from '../../../src/store';
import ComputedTransaction from '../../../src/computed/transaction';

describe('Computed Transactions Unit Tests', () => {
  let store;
  const bitcoinTransaction = {
    id: '0',
    type: 'bitcoin',
    amount: 923456,
    fee: 8250,
    confirmations: 0,
    status: 'unconfirmed',
    date: new Date(),
  };

  beforeEach(() => {
    store = new Store();
    store.settings.unit = 'btc';
    store.transactions.push(bitcoinTransaction);
    store.payments.push({
      id: '1',
      type: 'lightning',
      amount: 92345,
      fee: 1,
      status: 'complete',
      date: new Date(),
    });
    store.invoices.push({
      id: '2',
      type: 'lightning',
      amount: 81345,
      status: 'in-progress',
      date: new Date(),
    });
  });

  describe('ComputedTransaction()', () => {
    it('should work with empty store', () => {
      store.transactions = null;
      store.payments = null;
      store.invoices = null;
      ComputedTransaction(store);
      expect(store.computedTransactions.length, 'to equal', 0);
    });

    it('should aggregate transactions, payments, and invoices', () => {
      store.settings.displayFiat = false;
      ComputedTransaction(store);
      expect(store.computedTransactions.length, 'to equal', 3);
      const tx = store.computedTransactions.find(t => t.id === '0');
      expect(tx.idName, 'to equal', 'Transaction ID');
      expect(tx.typeLabel, 'to equal', 'Bitcoin');
      expect(tx.statusLabel, 'to equal', 'Unconfirmed');
      expect(tx.dateLabel, 'to be ok');
      expect(tx.dateTimeLabel, 'to be ok');
      expect(tx.amountLabel, 'to match', /0[,.]00923456/);
      expect(tx.feeLabel, 'to match', /0[,.]0000825/);
      expect(tx.confirmationsLabel, 'to equal', '0');
      const inv = store.computedTransactions.find(t => t.id === '2');
      expect(inv.feeLabel, 'to equal', '0');
      expect(inv.confirmationsLabel, 'to be', undefined);
    });

    it('should transaction values in usd', () => {
      store.settings.displayFiat = true;
      store.settings.exchangeRate.usd = 0.00014503;
      ComputedTransaction(store);
      expect(store.computedTransactions.length, 'to equal', 3);
      const tx = store.computedTransactions.find(t => t.id === '0');
      expect(tx.amountLabel, 'to match', /63[,.]67/);
      expect(tx.feeLabel, 'to match', /0[,.]57/);
    });

    it('should limit transactions to last 100', () => {
      store.payments = null;
      store.invoices = null;
      store.transactions = [];
      const TRANSACTIONS_COUNT = 101;
      [...Array(TRANSACTIONS_COUNT)].forEach(() =>
        store.transactions.push(bitcoinTransaction)
      );
      ComputedTransaction(store);
      expect(store.computedTransactions.length, 'to equal', 100);
    });
  });
});
