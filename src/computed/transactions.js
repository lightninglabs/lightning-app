import { computed, extendObservable } from 'mobx';

const ComputedTransactions = store => {
  extendObservable(store, {
    computedTransactions: computed(() => {
      const { transactions, paymentsResponse, invoices } = store;
      if (!transactions && !paymentsResponse && !invoices) return null;
      const t = transactions ? transactions.slice() : [];
      const p = paymentsResponse ? paymentsResponse.slice() : [];
      const i = invoices ? invoices.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => a.date.getTime() - b.date.getTime());
      return all;
    }),
  });
};

export default ComputedTransactions;
