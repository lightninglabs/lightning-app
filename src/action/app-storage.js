/**
 * @fileOverview repesents the local storage database on a user's device
 * which can be used to persist user settings on disk.
 */

import * as log from './log';

class AppStorage {
  constructor(store, AsyncStorage) {
    this._store = store;
    this._AsyncStorage = AsyncStorage;
  }

  /**
   * Read the user settings from disk and set them accordingly in the
   * application state. After the state has bee read to the global
   * `store` instance `store.loaded` is set to true.
   * @return {Promise<undefined>}
   */
  async restore() {
    try {
      const stateString = await this._AsyncStorage.getItem('settings');
      if (!stateString) return;
      const state = JSON.parse(stateString);
      Object.keys(state).forEach(key => {
        if (typeof this._store.settings[key] !== 'undefined') {
          this._store.settings[key] = state[key];
        }
      });
    } catch (err) {
      log.error('Store load error', err);
    } finally {
      log.info('Loaded initial state');
      this._store.loaded = true;
    }
  }

  /**
   * Persist the user settings to disk so that they may be read the
   * next time the application is opened by the user.
   * @return {Promise<undefined>}
   */
  async save() {
    try {
      const state = JSON.stringify(this._store.settings);
      await this._AsyncStorage.setItem('settings', state);
      log.info('Saved state');
    } catch (error) {
      log.error('Store save error', error);
    }
  }

  /**
   * Delete all of the data in local storage completely. Should be used
   * carefully e.g. when the user wants to wipe the data on disk.
   * @return {Promise<undefined>}
   */
  async clear() {
    try {
      await this._AsyncStorage.clear();
      log.info('State cleared');
    } catch (error) {
      log.error('Store clear error', error);
    }
  }
}

export default AppStorage;
