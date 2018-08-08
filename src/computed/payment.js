/**
 * @fileOverview computed values that are used in payment UI components.
 */

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
      const satAmount = toSatoshis(payment.amount, settings);
      const satFee = toSatoshis(payment.fee, settings);
      return toAmountLabel(satAmount + satFee, settings);
    }),
  });
};

export default ComputedPayment;
