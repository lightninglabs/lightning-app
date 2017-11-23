import { computed, extendObservable } from 'mobx';

const ComputedWallet = store => {
  extendObservable(store, {
    computedBalance: computed(() => {
      const { settings: { balanceSatoshis } } = store;
      return balanceSatoshis ? balanceSatoshis.toLocaleString() : '';
    }),
  });
};

export default ComputedWallet;
