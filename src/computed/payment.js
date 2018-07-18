import { computed, extendObservable } from 'mobx';
import { toSatoshis, toAmountLabel } from '../helper';

const ComputedPayment = store => {
  extendObservable(store, {
    paymentAmountLabel: computed(() => {
      const { payment, settings } = store;
      const satoshis = toSatoshis(payment.amount, settings.unit);
      return toAmountLabel(satoshis, store.settings);
    }),
    paymentFeeLabel: computed(() => {
      const { payment, settings } = store;
      const satoshis = toSatoshis(payment.fee, settings.unit);
      return toAmountLabel(satoshis, store.settings);
    }),
    paymentTotalLabel: computed(() => {
      const { payment, settings } = store;
      const satAmount = toSatoshis(payment.amount, settings.unit);
      const satFee = toSatoshis(payment.fee, settings.unit);
      return toAmountLabel(satAmount + satFee, store.settings);
    }),
  });
};

export default ComputedPayment;
