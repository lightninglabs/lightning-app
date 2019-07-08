/**
 * @fileOverview computed values that are used in settings UI components.
 */

import { extendObservable } from 'mobx';
import { formatNumber } from '../helper';
import { UNITS, FIATS } from '../config';

const ComputedSetting = store => {
  extendObservable(store, {
    get selectedUnitLabel() {
      return getUnitLabel(store.settings.unit);
    },
    get selectedFiatLabel() {
      return FIATS[store.settings.fiat].displayLong;
    },
    get satUnitLabel() {
      return getUnitLabel('sat');
    },
    get bitUnitLabel() {
      return getUnitLabel('bit');
    },
    get btcUnitLabel() {
      return getUnitLabel('btc');
    },
    get usdFiatLabel() {
      return FIATS['usd'].displayLong;
    },
    get eurFiatLabel() {
      return FIATS['eur'].displayLong;
    },
    get gbpFiatLabel() {
      return FIATS['gbp'].displayLong;
    },
    get mxnFiatLabel() {
      return FIATS['mxn'].displayLong;
    },
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
