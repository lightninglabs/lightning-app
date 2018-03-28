import { computed, extendObservable } from 'mobx';
import { formatSatoshis } from '../helper';

const ComputedWallet = store => {
  extendObservable(store, {
    computedBalance: computed(() => {
      const { balanceSatoshis } = store;
      return formatSatoshis(balanceSatoshis);
    }),
    computedChannelsBalance: computed(() => {
      const { channelBalanceSatoshis } = store;
      return formatSatoshis(channelBalanceSatoshis);
    }),
  });
};

export default ComputedWallet;
