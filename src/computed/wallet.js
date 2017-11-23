import { computed, extendObservable } from 'mobx';

const ComputedWallet = store => {
  extendObservable(store, {
    computedBalance: computed(() => {
      const { balanceSatoshis } = store;
      return balanceSatoshis !== null ? balanceSatoshis.toLocaleString() : '';
    }),
    computedChannelsBalance: computed(() => {
      const { channelBalanceSatoshis } = store;
      return channelBalanceSatoshis !== null
        ? channelBalanceSatoshis.toLocaleString()
        : '';
    }),
  });
};

export default ComputedWallet;
