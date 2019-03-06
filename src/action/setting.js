/**
 * @fileOverview actions to handle settings state and save persist
 * them to disk when they are updated by the user.
 */

import { UNITS, FIATS } from '../config';
import localeCurrency from 'locale-currency';
import * as log from './log';

class SettingAction {
  constructor(store, wallet, db, ipc, grpc, notification) {
    this._store = store;
    this._wallet = wallet;
    this._db = db;
    this._ipc = ipc;
    this._grpc = grpc;
    this._notification = notification;
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
    if (!FIATS[fiat]) {
      throw new Error(`Invalid fiat currency: ${fiat}`);
    }
    this._store.settings.fiat = fiat;
    this._wallet.getExchangeRate();
    this._db.save();
  }

  /**
   * Set whether or not we're restoring the wallet.
   * @param {boolean} options.restoring Whether or not we're restoring.
   */
  setRestoringWallet({ restoring }) {
    this._store.settings.restoring = restoring;
  }

  /**
   * Toggle whether autopilot is turned on.
   * @return {undefined}
   */
  async toggleAutopilot() {
    try {
      await this._grpc.sendAutopilotCommand('modifyStatus', {
        enable: !this._store.settings.autopilot,
      });
    } catch (err) {
      this._notification.display({
        msg: 'Unable to modify autopilot status.',
        err,
      });
      return;
    }
    this._store.settings.autopilot = !this._store.settings.autopilot;
  }

  /**
   * Detect the user's local fiat currency based on their OS locale.
   * If the currency is not supported use the default currency `usd`.
   * @return {Promise<undefined>}
   */
  async detectLocalCurrency() {
    try {
      let locale = await this._ipc.send('locale-get', 'locale');
      const fiat = localeCurrency.getCurrency(locale).toLowerCase();
      this.setFiatCurrency({ fiat });
    } catch (err) {
      log.error('Detecting local currency failed', err);
    }
  }
}

export default SettingAction;
