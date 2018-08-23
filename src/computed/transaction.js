/**
 * @fileOverview computed values that are used in transaction UI components.
 */

import { computed, extendObservable } from 'mobx';
import { toAmountLabel, toCaps } from '../helper';

const ComputedTransaction = store => {
  extendObservable(store, {
    computedTransactions: computed(() => {
      const { transactions, payments, invoices, settings } = store;
      const t = transactions ? transactions.slice() : [];
      const p = payments ? payments.slice() : [];
      const i = invoices ? invoices.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => b.date.getTime() - a.date.getTime());
      all.forEach(t => {
        t.idName = t.type === 'bitcoin' ? 'Transaction ID' : 'Invoice ID';
        t.typeLabel = toCaps(t.type);
        t.statusLabel = toCaps(t.status);
        t.dateLabel = t.date.toLocaleDateString();
        t.dateTimeLabel = t.date.toLocaleString();
        t.amountLabel = toAmountLabel(t.amount, settings);
        t.feeLabel = Number.isInteger(t.fee)
          ? toAmountLabel(t.fee, settings)
          : '-';
        if (Number.isInteger(t.confirmations)) {
          t.confirmationsLabel = t.confirmations.toString();
        }
      });
      return all;
    }),
  });
};

export default ComputedTransaction;
