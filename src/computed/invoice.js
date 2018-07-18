import { computed, extendObservable } from 'mobx';
import { toSatoshis, toAmountLabel } from '../helper';

const ComputedInvoice = store => {
  extendObservable(store, {
    invoiceAmountLabel: computed(() => {
      const { invoice, settings } = store;
      const satoshis = toSatoshis(invoice.amount, settings.unit);
      return toAmountLabel(satoshis, store.settings);
    }),
  });
};

export default ComputedInvoice;
