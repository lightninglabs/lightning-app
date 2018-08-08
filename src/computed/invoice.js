/**
 * @fileOverview computed values that are used in invoice UI components.
 */

import { computed, extendObservable } from 'mobx';
import { toLabel } from '../helper';

const ComputedInvoice = store => {
  extendObservable(store, {
    invoiceAmountLabel: computed(() =>
      toLabel(store.invoice.amount, store.settings)
    ),
  });
};

export default ComputedInvoice;
