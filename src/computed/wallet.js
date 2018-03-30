import { computed, extendObservable } from 'mobx';
import { formatNumber, formatFiat } from '../helper';
import { UNITS } from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
    balanceUnit: computed(() => {
      const { balanceSatoshis, settings } = store;
      const unit = UNITS[settings.unit];
      return formatNumber(balanceSatoshis / unit.denominator);
    }),
    channelBalanceUnit: computed(() => {
      const { channelBalanceSatoshis, settings } = store;
      const unit = UNITS[settings.unit];
      return formatNumber(channelBalanceSatoshis / unit.denominator);
    }),
    balanceFiat: computed(() => {
      const { balanceSatoshis, settings } = store;
      const rate = settings.exchangeRate[settings.fiat];
      const balance = balanceSatoshis / rate / UNITS.btc.denominator;
      return formatFiat(balance, settings.fiat);
    }),
    channelBalanceFiat: computed(() => {
      const { channelBalanceSatoshis, settings } = store;
      const rate = settings.exchangeRate[settings.fiat];
      const balance = channelBalanceSatoshis / rate / UNITS.btc.denominator;
      return formatFiat(balance, settings.fiat);
    }),
    balanceLabel: computed(() => {
      const { settings, balanceUnit, balanceFiat } = store;
      return settings.displayFiat ? balanceFiat : balanceUnit;
    }),
    channelBalanceLabel: computed(() => {
      const { settings, channelBalanceUnit, channelBalanceFiat } = store;
      return settings.displayFiat ? channelBalanceFiat : channelBalanceUnit;
    }),
    unitLabel: computed(() => {
      const { settings } = store;
      return !settings.displayFiat ? UNITS[settings.unit].display : null;
    }),
  });
};

export default ComputedWallet;
