import { observable, useStrict } from 'mobx';
import ComputedPayment from '../../../src/computed/payment';

describe('Computed Payment Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      payment: {
        address: '',
        amount: '',
        fee: '',
        note: '',
      },
    });
  });

  describe('ComputedPayment()', () => {
    it('should work with initial store', () => {
      ComputedPayment(store);
      expect(store.paymentTotalLabel, 'to equal', '0');
    });

    it('should calculate total', () => {
      store.payment.fee = '0.0001';
      store.payment.amount = '0.1';
      ComputedPayment(store);
      expect(store.paymentTotalLabel, 'to match', /^0[,.]1{1}0{2}1{1}$/);
    });
  });
});
