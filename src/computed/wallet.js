import { computed, extendObservable } from 'mobx';
import { formatNumber, formatFiat } from '../helper';
import { UNITS } from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
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
  });
};

const calculateExchangeRate = (satoshis, settings) => {
  const rate = settings.exchangeRate[settings.fiat];
  const balance = satoshis / rate / UNITS.btc.denominator;
  return formatFiat(balance, settings.fiat);
};

export default ComputedWallet;
