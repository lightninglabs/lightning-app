import { Store } from '../../../src/store';
import ComputedPayment from '../../../src/computed/payment';

describe('Computed Payment Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
    store.settings.unit = 'btc';
    store.settings.displayFiat = false;
  });

  describe('ComputedPayment()', () => {
    it('should work with initial store', () => {
      ComputedPayment(store);
      expect(store.paymentAmountLabel, 'to equal', '0');
      expect(store.paymentFeeEstimateItems, 'to equal', []);
      expect(store.paymentFeeLabel, 'to equal', '0');
      expect(store.paymentTotalLabel, 'to equal', '0');
    });

    it('should calculate fee estimate label', () => {
      store.unitLabel = 'sats';
      store.payment.feeEstimates = [
        {
          fee: '10',
          targetConf: 6,
          prio: 'Med',
        },
      ];
      ComputedPayment(store);
      expect(
        store.paymentFeeEstimateItems[0].label,
        'to match',
        /^Med 10 sats$/
      );
      expect(store.paymentFeeEstimateItems[0].value, 'to equal', 6);
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
      store.payment.fee = '0.10';
      store.payment.amount = '1.00';
      ComputedPayment(store);
      expect(store.paymentAmountLabel, 'to match', /1[,.]00/);
      expect(store.paymentFeeLabel, 'to match', /0[,.]10/);
      expect(store.paymentTotalLabel, 'to match', /1[,.]10/);
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
