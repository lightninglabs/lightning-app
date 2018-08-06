/**
 * @fileOverview actions to handle settings state and save persist
 * them to disk when they are updated by the user.
 */

import { UNITS, FIATS } from '../config';
import LocaleCurrency from 'locale-currency';
import { DEFAULT_FIAT } from '../config';

class SettingAction {
  constructor(store, grpc, wallet, db) {
    this._grpc = grpc;
    this._store = store;
    this._wallet = wallet;
    this._db = db;
  }

  /**
   * Set the bitcoin unit that is to be displayed in the UI and
   * perist the updated settings to disk.
   * @param {string} options.unit The bitcoin unit e.g. `btc`
   */
  setBitcoinUnit({ unit }) {
    if (!UNITS[unit]) {
      throw new Error(`Invalid bitcoin unit: ${unit}`);
    }
    this._store.settings.unit = unit;
    this._db.save();
  }

  /**
   * Set the fiat currency that is to be displayed in the UI and
   * perist the updated settings to disk.
   * @param {string} options.fiat The fiat currency e.g. `usd`
   */
  setFiatCurrency({ fiat }) {
    this._store.settings.fiat = FIATS[fiat] ? fiat : DEFAULT_FIAT;
    this._wallet.getExchangeRate();
    this._db.save();
  }

  async getLocale() {
    let response = await this._grpc.sendLocaleRequest();
    const fiat = LocaleCurrency.getCurrency(response.locale).toLowerCase();
    this.setFiatCurrency({ fiat });
  }
}

export default SettingAction;
