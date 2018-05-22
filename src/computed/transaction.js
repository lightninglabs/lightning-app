import { computed, extendObservable } from 'mobx';
import { toAmountLabel, toCaps } from '../helper';

const ComputedTransaction = store => {
  extendObservable(store, {
    computedTransactions: computed(() => {
      const { transactions, payments, invoices, settings } = store;
      if (!transactions && !payments && !invoices) return null;
      const t = transactions ? transactions.slice() : [];
      const p = payments ? payments.slice() : [];
      const i = invoices ? invoices.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => b.date.getTime() - a.date.getTime());
      all.forEach(t => {
        t.statusLabel = toCaps(t.status);
        t.dateLabel = t.date.toLocaleDateString();
        t.amountLabel = toAmountLabel(t.amount, settings);
        t.feeLabel = Number.isInteger(t.fee)
          ? toAmountLabel(t.fee, settings)
          : '-';
      });
      return all;
    }),
  });
};

export default ComputedTransaction;
