import { computed, extendObservable } from 'mobx';
import { formatNumber } from '../helper';

const ComputedWallet = store => {
  extendObservable(store, {
    computedBalance: computed(() => {
      const { balanceSatoshis } = store;
      return formatNumber(balanceSatoshis);
    }),
    computedChannelsBalance: computed(() => {
      const { channelBalanceSatoshis } = store;
      return formatNumber(channelBalanceSatoshis);
    }),
  });
};

export default ComputedWallet;
