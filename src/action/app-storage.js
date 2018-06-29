import * as log from './log';

class AppStorage {
  constructor(store, AsyncStorage) {
    this._store = store;
    this._AsyncStorage = AsyncStorage;
  }

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

  async save() {
    try {
      const state = JSON.stringify(this._store.settings);
      await this._AsyncStorage.setItem('settings', state);
      log.info('Saved state');
    } catch (error) {
      log.error('Store save error', error);
    }
  }

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
