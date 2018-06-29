import { UNITS, FIATS } from '../config';

class SettingAction {
  constructor(store, wallet) {
    this._store = store;
    this._wallet = wallet;
  }

  setBitcoinUnit({ unit }) {
    if (!UNITS[unit]) {
      throw new Error(`Invalid bitcoin unit: ${unit}`);
    }
    this._store.settings.unit = unit;
    this._store.save();
  }

  setFiatCurrency({ fiat }) {
    if (!FIATS[fiat]) {
      throw new Error(`Invalid fiat currency: ${fiat}`);
    }
    this._store.settings.fiat = fiat;
    this._wallet.getExchangeRate();
    this._store.save();
  }
}

export default SettingAction;
