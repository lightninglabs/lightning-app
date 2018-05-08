import { computed, extendObservable } from 'mobx';
import { formatNumber } from '../helper';

const ComputedPayment = store => {
  extendObservable(store, {
    paymentTotalLabel: computed(() => {
      const { payment } = store;
      return formatNumber(Number(payment.amount) + Number(payment.fee));
    }),
  });
};

export default ComputedPayment;
