import { computed, extendObservable } from 'mobx';
import { formatNumber } from '../helper';
import { UNITS, FIATS } from '../config';

const ComputedSetting = store => {
  extendObservable(store, {
    selectedUnitLabel: computed(() => getUnitLabel(store.settings.unit)),
    selectedFiatLabel: computed(() => FIATS[store.settings.fiat].display),
    notificationCountLabel: computed(() =>
      formatNumber(store.notifications.length)
    ),
    satUnitLabel: computed(() => getUnitLabel('sat')),
    bitUnitLabel: computed(() => getUnitLabel('bit')),
    btcUnitLabel: computed(() => getUnitLabel('btc')),
    usdFiatLabel: computed(() => FIATS['usd'].display),
    eurFiatLabel: computed(() => FIATS['eur'].display),
    gbpFiatLabel: computed(() => FIATS['gbp'].display),
  });
};

const getUnitLabel = type => {
  const unit = UNITS[type];
  if (unit.display === 'BTC') {
    return unit.displayLong;
  }
  const denominator = formatNumber(unit.denominator / UNITS.btc.denominator);
  return `${unit.displayLong}   (${denominator} ${UNITS.btc.display})`;
};

export default ComputedSetting;
