import { observable, useStrict } from 'mobx';
import ComputedInvoice from '../../../src/computed/invoice';

describe('Computed Invoice Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      invoice: {
        address: '',
        amount: '',
        fee: '',
        note: '',
      },
    });
  });

  describe('ComputedInvoice()', () => {
    it('should work with initial store', () => {
      ComputedInvoice(store);
      expect(store.invoiceAmountLabel, 'to equal', '0');
    });

    it('should format amount', () => {
      store.invoice.amount = '0.1001';
      ComputedInvoice(store);
      expect(store.invoiceAmountLabel, 'to match', /^0[,.]1{1}0{2}1{1}$/);
    });
  });
});
