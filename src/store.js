import { AsyncStorage } from 'react-native';
import { extendObservable, action, observable } from 'mobx';
import ComputedWallet from './computed/wallet';
import ComputedTransactions from './computed/transactions';
import { DEFAULT_ROUTE } from './config';

class Store {
  constructor() {
    extendObservable(this, {
      lndReady: false, // Is lnd process running
      route: DEFAULT_ROUTE,

      balanceSatoshis: null,
      confirmedBalanceSatoshis: null,
      unconfirmedBalanceSatoshis: null,
      channelBalanceSatoshis: null,
      pubKey: null,
      walletAddress: null,

      transactionsResponse: null,
      invoicesResponse: null,
      paymentsResponse: null,

      logs: observable([]),

      // Persistent data
      settings: {},
    });

    ComputedWallet(this);
    ComputedTransactions(this);

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
