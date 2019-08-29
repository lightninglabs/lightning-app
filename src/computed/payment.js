/**
 * @fileOverview computed values that are used in payment UI components.
 */

import { extendObservable } from 'mobx';
import { toSatoshis, toAmountLabel, toLabel } from '../helper';

const ComputedPayment = store => {
  extendObservable(store, {
    get paymentAmountLabel() {
      return toLabel(store.payment.amount, store.settings);
    },
    get paymentFeeEstimateItems() {
      return store.payment.feeEstimates.map(e => {
        const feeLabel = toLabel(e.fee, store.settings);
        return {
          label: `${e.prio} ${feeLabel} ${store.unitLabel || ''}`.trim(),
          value: e.targetConf,
        };
      });
    },
    get paymentFeeLabel() {
      return toLabel(store.payment.fee, store.settings);
    },
    get paymentTotalLabel() {
      const { payment, settings } = store;
      const satAmount = toSatoshis(payment.amount, settings);
      const satFee = toSatoshis(payment.fee, settings);
      return toAmountLabel(satAmount + satFee, settings);
    },
  });
};

export default ComputedPayment;
