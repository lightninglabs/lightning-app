import { Store } from '../../../src/store';
import ComputedPayment from '../../../src/computed/payment';

describe('Computed Payment Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('ComputedPayment()', () => {
    it('should work with initial store', () => {
      ComputedPayment(store);
      expect(store.paymentAmountLabel, 'to equal', '0');
      expect(store.paymentFeeLabel, 'to equal', '0');
      expect(store.paymentTotalLabel, 'to equal', '0');
    });

    it('should calculate btc total', () => {
      store.payment.fee = '0.0001';
      store.payment.amount = '0.1';
      ComputedPayment(store);
      expect(store.paymentAmountLabel, 'to match', /^0[,.]1{1}$/);
      expect(store.paymentFeeLabel, 'to match', /^0[,.]0{3}1{1}$/);
      expect(store.paymentTotalLabel, 'to match', /^0[,.]1{1}0{2}1{1}$/);
    });

    it('should calculate fiat total', () => {
      store.settings.displayFiat = true;
      store.settings.exchangeRate.usd = 0.00014503;
      store.payment.fee = '0.0001';
      store.payment.amount = '0.1';
      ComputedPayment(store);
      expect(store.paymentAmountLabel, 'to match', /689[,.]51/);
      expect(store.paymentFeeLabel, 'to match', /0[,.]69/);
      expect(store.paymentTotalLabel, 'to match', /690[,.]20/);
    });

    it('should ignore fee if blank', () => {
      store.payment.fee = '';
      store.payment.amount = '0.1';
      ComputedPayment(store);
      expect(store.paymentAmountLabel, 'to match', /^0[,.]1{1}$/);
      expect(store.paymentFeeLabel, 'to equal', '0');
      expect(store.paymentTotalLabel, 'to match', /^0[,.]1{1}$/);
    });
  });
});
