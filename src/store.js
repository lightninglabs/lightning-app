import { AsyncStorage } from 'react-native';
import { extendObservable, action } from 'mobx';
import ComputedWallet from './computed/wallet';

class Store {
  constructor() {
    extendObservable(this, {
      lndReady: false, // Is lnd process running
      route: 'Pay',

      balanceSatoshis: 7000,
      pubkey: null,

      // Persistent data
      settings: {},
    });

    ComputedWallet(this);

    try {
      AsyncStorage.getItem('settings').then(
        action(stateString => {
          const state = JSON.parse(stateString);
          state &&
            Object.keys(state).map(key => {
              if (typeof this.settings[key] !== 'undefined') {
                this.settings[key] = state[key];
              }
            });
          console.log('Loaded initial state');
        })
      );
    } catch (err) {
      console.log('Store load error', err);
    }
  }

  save() {
    try {
      const state = JSON.stringify(this.settings);
      AsyncStorage && AsyncStorage.setItem('settings', state);
      console.log('Saved state');
    } catch (error) {
      console.log('Store Error', error);
    }
  }

  clear() {
    console.log('!!!!!!!!!CLEARING ALL PERSISTENT DATA!!!!!!');
    Object.keys(this.settings).map(key => (this.settings[key] = null));
    this.save();
  }
}

export default new Store();
