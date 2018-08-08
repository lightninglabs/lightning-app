/**
 * @fileOverview computed values that are used in settings UI components.
 */

import { computed, extendObservable } from 'mobx';
import { formatNumber } from '../helper';
import { UNITS, FIATS } from '../config';

const ComputedSetting = store => {
  extendObservable(store, {
    selectedUnitLabel: computed(() => getUnitLabel(store.settings.unit)),
    selectedFiatLabel: computed(() => FIATS[store.settings.fiat].displayLong),
    satUnitLabel: computed(() => getUnitLabel('sat')),
    bitUnitLabel: computed(() => getUnitLabel('bit')),
    btcUnitLabel: computed(() => getUnitLabel('btc')),
    usdFiatLabel: computed(() => FIATS['usd'].displayLong),
    eurFiatLabel: computed(() => FIATS['eur'].displayLong),
    gbpFiatLabel: computed(() => FIATS['gbp'].displayLong),
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
