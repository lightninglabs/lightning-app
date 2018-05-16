import { computed, extendObservable } from 'mobx';
import { toAmountLabel } from '../helper';
import { UNITS } from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
    walletAddressUri: computed(
      () => (store.walletAddress ? `bitcoin:${store.walletAddress}` : '')
    ),
    balanceLabel: computed(() =>
      toAmountLabel(store.balanceSatoshis, store.settings)
    ),
    channelBalanceLabel: computed(() =>
      toAmountLabel(store.channelBalanceSatoshis, store.settings)
    ),
    unitLabel: computed(() => {
      const { settings } = store;
      return !settings.displayFiat ? UNITS[settings.unit].display : null;
    }),
    unit: computed(() => UNITS[store.settings.unit].display),
  });
};

export default ComputedWallet;
