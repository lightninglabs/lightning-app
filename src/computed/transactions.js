import { computed, extendObservable } from 'mobx';

const ComputedTransactions = store => {
  extendObservable(store, {
    computedTransactions: computed(() => {
      const { transactions, paymentsResponse, invoicesResponse } = store;
      if (!transactions && !paymentsResponse && !invoicesResponse) return null;
      const t = transactions ? transactions.slice() : [];
      const p = paymentsResponse ? paymentsResponse.slice() : [];
      const i = invoicesResponse ? invoicesResponse.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => a.date.getTime() - b.date.getTime());
      return all;
    }),
  });
};

export default ComputedTransactions;
