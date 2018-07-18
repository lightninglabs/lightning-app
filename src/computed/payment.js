import { computed, extendObservable } from 'mobx';
import { toSatoshis, toAmountLabel, toLabel } from '../helper';

const ComputedPayment = store => {
  extendObservable(store, {
    paymentAmountLabel: computed(() =>
      toLabel(store.payment.amount, store.settings)
    ),
    paymentFeeLabel: computed(() => toLabel(store.payment.fee, store.settings)),
    paymentTotalLabel: computed(() => {
      const { payment, settings } = store;
      const satAmount = toSatoshis(payment.amount, settings.unit);
      const satFee = toSatoshis(payment.fee, settings.unit);
      return toAmountLabel(satAmount + satFee, store.settings);
    }),
  });
};

export default ComputedPayment;
