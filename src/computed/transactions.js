import { computed, extendObservable } from 'mobx';

const ComputedTransactions = store => {
  extendObservable(store, {
    computedTransactions: computed(() => {
      const { transactions, payments, invoices } = store;
      if (!transactions && !payments && !invoices) return null;
      const t = transactions ? transactions.slice() : [];
      const p = payments ? payments.slice() : [];
      const i = invoices ? invoices.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => a.date.getTime() - b.date.getTime());
      return all;
    }),
  });
};

export default ComputedTransactions;
