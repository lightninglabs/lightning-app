import { computed, extendObservable } from 'mobx';
import { toAmountLabel, toLabel, fiatToSatoshis } from '../helper';

const ComputedInvoice = store => {
  extendObservable(store, {
    invoiceAmountLabel: computed(() => {
      const { invoice, settings } = store;
      return settings.displayFiat
        ? toAmountLabel(fiatToSatoshis(invoice.amount, settings), settings)
        : toLabel(invoice.amount, settings);
    }),
  });
};

export default ComputedInvoice;
