import { computed, extendObservable } from 'mobx';
import { formatNumber, calculateExchangeRate } from '../helper';
import { UNITS } from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
    walletAddressUri: computed(
      () => (store.walletAddress ? `bitcoin:${store.walletAddress}` : '')
    ),
    balanceLabel: computed(() => {
      const { balanceSatoshis: satoshis, settings } = store;
      return settings.displayFiat
        ? calculateExchangeRate(satoshis, settings)
        : formatNumber(satoshis / UNITS[settings.unit].denominator);
    }),
    channelBalanceLabel: computed(() => {
      const { channelBalanceSatoshis: satoshis, settings } = store;
      return settings.displayFiat
        ? calculateExchangeRate(satoshis, settings)
        : formatNumber(satoshis / UNITS[settings.unit].denominator);
    }),
    unitLabel: computed(() => {
      const { settings } = store;
      return !settings.displayFiat ? UNITS[settings.unit].display : null;
    }),
    unit: computed(() => UNITS[store.settings.unit].display),
  });
};

export default ComputedWallet;
