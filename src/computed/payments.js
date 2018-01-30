import { computed, extendObservable } from 'mobx';

const ComputedPayments = store => {
  extendObservable(store, {
    computedPaymentRequest: computed(() => {
      const { paymentsResponse } = store;
      if (!paymentsResponse) {
        return {};
      }
      return {
        numSatoshis: paymentsResponse.num_satoshis,
        description: paymentsResponse.description,
      };
    }),
  });
};

export default ComputedPayments;
