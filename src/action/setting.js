import { UNITS } from '../config';

class SettingAction {
  constructor(store) {
    this._store = store;
  }

  //
  // Bitcoin Unit actions
  //

  setBitcoinUnit(unit) {
    if (this._store.settings.unit === unit) {
      return;
    } else if (!(unit in UNITS)) {
      return;
    }
    this._store.settings.unit = unit;
  }
}

export default SettingAction;
