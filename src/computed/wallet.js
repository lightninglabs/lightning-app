/**
 * @fileOverview computed values that are used in wallet UI components.
 */

import { extendObservable } from 'mobx';
import { toAmountLabel } from '../helper';
import { UNITS, FIATS } from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
    get walletAddressUri() {
      return store.walletAddress ? `bitcoin:${store.walletAddress}` : '';
    },
    get depositLabel() {
      const { balanceSatoshis, pendingBalanceSatoshis, settings } = store;
      return toAmountLabel(balanceSatoshis + pendingBalanceSatoshis, settings);
    },
    get channelBalanceLabel() {
      return toAmountLabel(store.channelBalanceSatoshis, store.settings);
    },
    get unitFiatLabel() {
      const { displayFiat, unit, fiat } = store.settings;
      return displayFiat ? FIATS[fiat].display : UNITS[unit].display;
    },
    get unitLabel() {
      const { settings } = store;
      return !settings.displayFiat ? UNITS[settings.unit].display : null;
    },
  });
};

export default ComputedWallet;
