/**
 * @fileOverview computed values that are used in wallet UI components.
 */

import { computed, extendObservable } from 'mobx';
import { toAmountLabel } from '../helper';
import { UNITS, FIATS } from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
    walletAddressUri: computed(
      () => (store.walletAddress ? `bitcoin:${store.walletAddress}` : '')
    ),
    depositLabel: computed(() => {
      const { balanceSatoshis, pendingBalanceSatoshis, settings } = store;
      return toAmountLabel(balanceSatoshis + pendingBalanceSatoshis, settings);
    }),
    channelBalanceLabel: computed(() =>
      toAmountLabel(store.channelBalanceSatoshis, store.settings)
    ),
    unitFiatLabel: computed(() => {
      const { displayFiat, unit, fiat } = store.settings;
      return displayFiat ? FIATS[fiat].display : UNITS[unit].display;
    }),
    unitLabel: computed(() => {
      const { settings } = store;
      return !settings.displayFiat ? UNITS[settings.unit].display : null;
    }),
  });
};

export default ComputedWallet;
