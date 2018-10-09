/**
 * @fileOverview computed values that are used in invoice UI components.
 */

import { extendObservable } from 'mobx';
import { toLabel } from '../helper';

const ComputedInvoice = store => {
  extendObservable(store, {
    get invoiceAmountLabel() {
      return toLabel(store.invoice.amount, store.settings);
    },
  });
};

export default ComputedInvoice;
