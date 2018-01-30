import { observable, useStrict } from 'mobx';
import ComputedPayments from '../../../src/computed/payments';

describe('Computed Payments Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
  });

  describe('ComputedPayments()', () => {
    it('should properly decode payment request', () => {
      store = observable({
        paymentsResponse: {
          destination:
            '035b55e3e08538afeef6ff9804e3830293eec1c4a6a9570f1e96a478dad1c86fed',
          payment_hash:
            'f99a06c85c12fe00bdd39cc852bf0c606bec23560d81dddbe887dd12f3783c95',
          num_satoshis: '1700',
          timestamp: '1516991998',
          expiry: '3600',
          description: '1 Espresso Coin Panna',
          description_hash: '',
          fallback_addr: '',
          cltv_expiry: '9',
        },
      });
      ComputedPayments(store);
      expect(
        store.computedPaymentRequest.description,
        'to be',
        '1 Espresso Coin Panna'
      );
      expect(store.computedPaymentRequest.numSatoshis, 'to be', '1700');
    });
  });
});
