/**
 * @fileOverview computed values that are used in transaction UI components.
 */

import { extendObservable } from 'mobx';
import { toAmountLabel, toCaps } from '../helper';

const ComputedTransaction = store => {
  extendObservable(store, {
    get computedTransactions() {
      const { transactions, payments, invoices, settings } = store;
      const t = transactions ? transactions.slice() : [];
      const p = payments ? payments.slice() : [];
      const i = invoices ? invoices.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => b.date.getTime() - a.date.getTime());
      all.forEach((t, i) => {
        t.key = String(i);
        t.idName = t.type === 'bitcoin' ? 'Transaction ID' : 'Invoice ID';
        t.typeLabel = toCaps(t.type);
        t.statusLabel = toCaps(t.status);
        t.dateLabel = t.date.toLocaleDateString();
        t.dateTimeLabel = t.date.toLocaleString();
        t.amountLabel = toAmountLabel(t.amount, settings);
        t.feeLabel = toAmountLabel(t.fee || 0, settings);
        if (Number.isInteger(t.confirmations)) {
          t.confirmationsLabel = t.confirmations.toString();
        }
      });
      return all.slice(0, 100);
    },
  });
};

export default ComputedTransaction;
