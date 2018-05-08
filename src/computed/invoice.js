import { computed, extendObservable } from 'mobx';
import { formatNumber } from '../helper';

const ComputedInvoice = store => {
  extendObservable(store, {
    invoiceAmountLabel: computed(() => formatNumber(store.invoice.amount)),
  });
};

export default ComputedInvoice;
