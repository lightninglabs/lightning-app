import { extendObservable } from 'mobx';
import ComputedWallet from './computed/wallet';
import ComputedTransaction from './computed/transaction';
import ComputedChannel from './computed/channel';
import ComputedInvoice from './computed/invoice';
import ComputedPayment from './computed/payment';
import ComputedNotification from './computed/notification';
import ComputedSetting from './computed/setting';
import ComputedSeed from './computed/seed';
import { DEFAULT_ROUTE, DEFAULT_UNIT, DEFAULT_FIAT } from './config';
import * as log from './action/log';

export class Store {
  constructor() {
    extendObservable(this, {
      loaded: false, // Is persistent data loaded
      unlockerReady: false, // Is wallet unlocker running
      walletUnlocked: false, // Is the wallet unlocked
      lndReady: false, // Is lnd process running
      syncedToChain: false, // Is lnd synced to blockchain
      route: DEFAULT_ROUTE,
      blockHeight: null,
      balanceSatoshis: 0,
      confirmedBalanceSatoshis: 0,
      unconfirmedBalanceSatoshis: 0,
      channelBalanceSatoshis: 0,
      pubKey: null,
      walletAddress: null,
      displayCopied: false,
      ipAddress: null,
      wallet: {
        password: '',
        passwordVerify: '',
        seedVerify: ['', '', ''],
      },
      transactions: [],
      selectedTransaction: null,
      invoices: [],
      invoice: {
        amount: '',
        note: '',
        encoded: '',
        uri: '',
      },
      payments: [],
      payment: {
        address: '',
        amount: '',
        fee: '',
        note: '',
      },
      peers: [],
      channels: [],
      pendingChannels: [],
      selectedChannel: null,
      channel: {
        pubkeyAtHost: '',
        amount: '',
      },
      paymentRequest: null,
      seedMnemonic: [],
      notifications: [],
      logs: [],

      // Persistent data
      settings: {
        unit: DEFAULT_UNIT,
        fiat: DEFAULT_FIAT,
        displayFiat: false,
        exchangeRate: {},
      },
    });
  }

  init() {
    ComputedWallet(this);
    ComputedTransaction(this);
    ComputedChannel(this);
    ComputedInvoice(this);
    ComputedPayment(this);
    ComputedNotification(this);
    ComputedSetting(this);
    ComputedSeed(this);
  }

  async restore(AsyncStorage) {
    this._AsyncStorage = AsyncStorage;
    try {
      const stateString = await this._AsyncStorage.getItem('settings');
      const state = JSON.parse(stateString);
      state &&
        Object.keys(state).forEach(key => {
          if (typeof this.settings[key] !== 'undefined') {
            this.settings[key] = state[key];
          }
        });
      log.info('Loaded initial state');
      this.loaded = true;
    } catch (err) {
      log.error('Store load error', err);
      this.loaded = true;
    }
  }

  async save() {
    try {
      const state = JSON.stringify(this.settings);
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

export default new Store();
