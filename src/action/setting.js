import { UNITS, DEFAULT_UNIT } from '../config';

class SettingAction {
  constructor(store) {
    this._store = store;
  }

  init() {
    this._store.settings.unit = DEFAULT_UNIT;
  }

  //
  // Bitcoin unit setting actions
  //

  setBitcoinUnit({ unit }) {
    if (!(unit in UNITS)) {
      throw new Error(`Invalid bitcoin unit: ${unit}`);
    }
    this._store.settings.unit = unit;
  }
}

export default SettingAction;
