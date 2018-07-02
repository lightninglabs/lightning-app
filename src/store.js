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
}

export default new Store();
