import { UNITS } from '../config';

class SettingAction {
  constructor(store) {
    this._store = store;
  }

  setBitcoinUnit({ unit }) {
    if (!UNITS[unit]) {
      throw new Error(`Invalid bitcoin unit: ${unit}`);
    }
    this._store.settings.unit = unit;
  }
}

export default SettingAction;
