import { observable, useStrict } from 'mobx';
import ComputedTransaction from '../../../src/computed/transaction';
import { DEFAULT_UNIT, DEFAULT_FIAT } from '../../../src/config';

describe('Computed Transactions Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      settings: {
        unit: DEFAULT_UNIT,
        fiat: DEFAULT_FIAT,
        displayFiat: false,
        exchangeRate: {
          usd: null,
          eur: null,
        },
      },
      transactions: [
        {
          id: '0',
          type: 'bitcoin',
          amount: 923456,
          fee: 8250,
          status: 'unconfirmed',
          date: new Date(),
        },
      ],
      payments: [
        {
          id: '1',
          type: 'lightning',
          amount: 92345,
          fee: 1,
          status: 'complete',
          date: new Date(),
        },
      ],
      invoices: [
        {
          id: '2',
          type: 'lightning',
          amount: 81345,
          status: 'in-progress',
          date: new Date(),
        },
      ],
    });
  });

  describe('ComputedTransaction()', () => {
    it('should work with empty store', () => {
      store.transactions = null;
      store.payments = null;
      store.invoices = null;
      ComputedTransaction(store);
      expect(store.computedTransactions, 'to equal', null);
    });

    it('should aggregate transactions, payments, and invoices', () => {
      ComputedTransaction(store);
      expect(store.computedTransactions.length, 'to equal', 3);
      const tx = store.computedTransactions.find(t => t.id === '0');
      expect(tx.statusLabel, 'to equal', 'Unconfirmed');
      expect(tx.dateLabel, 'to be ok');
      expect(tx.amountLabel, 'to match', /0[,.]00923456/);
      expect(tx.feeLabel, 'to match', /0[,.]0000825/);
      const inv = store.computedTransactions.find(t => t.id === '2');
      expect(inv.feeLabel, 'to equal', '-');
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
  });
});
