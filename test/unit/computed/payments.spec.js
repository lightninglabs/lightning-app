import { observable, useStrict } from 'mobx';
import ComputedPayments from '../../../src/computed/payments';

describe('Computed Channels Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
  });

  describe('ComputedPayments()', () => {
    it('should work with empty store', () => {
      store = observable({
        paymentRequestResponse: {},
        paymentInfo: {
          payment: '',
          amount: '',
        },
      });
      ComputedPayments(store);
      expect(store.computedPayment.amount, 'to be', '');
    });

    it('should compute correctly with user populated fields', () => {
      store = observable({
        paymentInfo: {
          payment: '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX',
          amount: '123',
        },
        paymentRequestResponse: {},
      });
      ComputedPayments(store);
      expect(
        store.computedPayment.payment,
        'to be',
        '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX'
      );
      expect(store.computedPayment.amount, 'to be', '123');
      expect(store.computedPayment.isPaymentRequest, 'to be', false);
    });
  });

  it('should compute correctly with payment request', () => {
    store = observable({
      paymentInfo: {},
      paymentRequestResponse: {
        numSatoshis: '456',
        description: 'testing',
      },
    });
    ComputedPayments(store);
    expect(store.computedPayment.amount, 'to be', '456');
    expect(store.computedPayment.description, 'to be', 'testing');
    expect(store.computedPayment.isPaymentRequest, 'to be', true);
  });
});
