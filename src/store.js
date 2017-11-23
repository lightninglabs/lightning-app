import { AsyncStorage } from 'react-native';
import { extendObservable, action, computed, observable } from 'mobx';
import ComputedWallet from './computed/wallet';

class Store {
  constructor() {
    extendObservable(this, {
      route: 'Pay',

      // Persistent data
      settings: {
        balanceSatoshis: 7000,
        pubkey: '23984723984708924357092374982374',
      },
    });

    ComputedWallet(this);

    AsyncStorage.getItem('settings')
      .then(
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
      )
      .catch(err => console.log('Store load error', err));
  }

  save() {
    try {
      const state = JSON.stringify(this.settings);
      AsyncStorage.setItem('settings', state);
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
