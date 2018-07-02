import { UNITS, FIATS } from '../config';

class SettingAction {
  constructor(store, wallet, db) {
    this._store = store;
    this._wallet = wallet;
    this._db = db;
  }

  setBitcoinUnit({ unit }) {
    if (!UNITS[unit]) {
      throw new Error(`Invalid bitcoin unit: ${unit}`);
    }
    this._store.settings.unit = unit;
    this._db.save();
  }

  setFiatCurrency({ fiat }) {
    if (!FIATS[fiat]) {
      throw new Error(`Invalid fiat currency: ${fiat}`);
    }
    this._store.settings.fiat = fiat;
    this._wallet.getExchangeRate();
    this._db.save();
  }
}

export default SettingAction;
