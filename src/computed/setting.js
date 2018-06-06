import { computed, extendObservable } from 'mobx';
import { formatNumber } from '../helper';
import { UNITS, FIATS } from '../config';

const ComputedSetting = store => {
  extendObservable(store, {
    selectedUnitLabel: computed(() => {
      const { settings } = store;
      const unit = UNITS[settings.unit];
      if (settings.unit === 'btc') {
        return unit.display;
      }
      const denominator = formatNumber(
        unit.denominator / UNITS.btc.denominator
      );
      return `${unit.display} (${denominator} ${UNITS.btc.display})`;
    }),
    selectedFiatLabel: computed(() => FIATS[store.settings.fiat].display),
    notificationCountLabel: computed(() =>
      formatNumber(store.notifications.length)
    ),
  });
};

export default ComputedSetting;
