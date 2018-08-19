/**
 * @fileOverview computed values that are used in wallet UI components.
 */

import { computed, extendObservable } from 'mobx';
import { toAmountLabel } from '../helper';
import {
  UNITS,
  FIATS,
  MIN_PASSWORD_LENGTH,
  STRONG_PASSWORD_LENGTH,
} from '../config';
import { color } from '../component/style';

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
    newPasswordCopy: computed(() => {
      const { newPassword } = store.wallet;
      return getNewPasswordCopy({ newPassword });
    }),
    newPasswordCheckColor: computed(() => {
      const { newPassword } = store.wallet;
      if (!newPassword) {
        return color.blackText;
      }
      return newPassword.length < MIN_PASSWORD_LENGTH ? color.red : color.green;
    }),
  });
};

/**
 * If necessary, return copy advising the user on the quality of their password.
 * @param  {string} options.walletPassword The password used to encrypt the wallet
 * @return {string}
 */
const getNewPasswordCopy = ({ newPassword }) => {
  if (newPassword.length >= STRONG_PASSWORD_LENGTH) {
    return "Now that's a strong password!";
  } else if (newPassword.length >= MIN_PASSWORD_LENGTH) {
    return 'Pro tip: add a few more characters to strengthen your password.';
  }
  return '';
};

export default ComputedWallet;
