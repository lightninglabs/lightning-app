import { computed, extendObservable } from 'mobx';

const ComputedTransactions = store => {
  extendObservable(store, {
    computedTransactions: computed(() => {
      const {
        transactionsResponse,
        paymentsResponse,
        invoicesResponse,
      } = store;
      if (!transactionsResponse && !paymentsResponse && !invoicesResponse)
        return null;
      const t = transactionsResponse ? transactionsResponse.slice() : [];
      const p = paymentsResponse ? paymentsResponse.slice() : [];
      const i = invoicesResponse ? invoicesResponse.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => a.date.getTime() - b.date.getTime());
      return all;
    }),
  });
};

export default ComputedTransactions;
