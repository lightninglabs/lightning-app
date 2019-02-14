import { Store } from '../../../src/store';
import ComputedInvoice from '../../../src/computed/invoice';

describe('Computed Invoice Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
    store.settings.unit = 'btc';
    store.settings.displayFiat = false;
  });

  describe('ComputedInvoice()', () => {
    it('should work with initial store', () => {
      ComputedInvoice(store);
      expect(store.invoiceAmountLabel, 'to equal', '0');
    });

    it('should format btc amount', () => {
      store.invoice.amount = '0.1001';
      ComputedInvoice(store);
      expect(store.invoiceAmountLabel, 'to match', /^0[,.]1{1}0{2}1{1}$/);
    });

    it('should format fiat amount', () => {
      store.settings.displayFiat = true;
      store.settings.exchangeRate.usd = 0.00014503;
      store.invoice.amount = '1.10';
      ComputedInvoice(store);
      expect(store.invoiceAmountLabel, 'to match', /1[,.]10/);
    });
  });
});
