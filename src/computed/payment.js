import { computed, extendObservable } from 'mobx';
import { formatNumber } from '../helper';

const ComputedPayment = store => {
  extendObservable(store, {
    paymentAmountLabel: computed(() => formatNumber(store.payment.amount)),
    paymentFeeLabel: computed(() => formatNumber(store.payment.fee)),
    paymentTotalLabel: computed(() => {
      const { payment } = store;
      return formatNumber(Number(payment.amount) + Number(payment.fee));
    }),
  });
};

export default ComputedPayment;
