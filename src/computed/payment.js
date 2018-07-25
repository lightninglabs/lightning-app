import { computed, extendObservable } from 'mobx';
import { fiatToSatoshis, toSatoshis, toAmountLabel, toLabel } from '../helper';

const ComputedPayment = store => {
  extendObservable(store, {
    paymentAmountLabel: computed(() => {
      const { payment, settings } = store;
      return settings.displayFiat
        ? toAmountLabel(fiatToSatoshis(payment.amount, settings), settings)
        : toLabel(store.payment.amount, store.settings);
    }),
    paymentFeeLabel: computed(() => {
      const { payment, settings } = store;
      return settings.displayFiat
        ? toAmountLabel(fiatToSatoshis(payment.fee, settings), settings)
        : toLabel(store.payment.fee, store.settings);
    }),
    paymentTotalLabel: computed(() => {
      const { payment, settings } = store;
      const satAmount = settings.displayFiat
        ? fiatToSatoshis(payment.amount, settings)
        : toSatoshis(payment.amount, settings.unit);
      const satFee = settings.displayFiat
        ? fiatToSatoshis(payment.fee, settings)
        : toSatoshis(payment.fee, settings.unit);
      return toAmountLabel(satAmount + satFee, settings);
    }),
  });
};

export default ComputedPayment;
