/**
 * @fileOverview the global application store used by mobx for
 * state management. These values are either rendered directly
 * in react components or used as a basis for computed values.
 */

import { extendObservable } from 'mobx';
import ComputedLoaderMsg from './computed/loader-msg';
import ComputedWallet from './computed/wallet';
import ComputedTransaction from './computed/transaction';
import ComputedChannel from './computed/channel';
import ComputedInvoice from './computed/invoice';
import ComputedPayment from './computed/payment';
import ComputedNotification from './computed/notification';
import ComputedSetting from './computed/setting';
import ComputedSeed from './computed/seed';
import {
  DEFAULT_ROUTE,
  DEFAULT_UNIT,
  DEFAULT_FIAT,
  MED_TARGET_CONF,
} from './config';

export class Store {
  constructor() {
    extendObservable(this, {
      navReady: false, // the navigator on mobile is ready
      loaded: false, // Is persistent data loaded
      unlockerReady: false, // Is wallet unlocker running
      firstStart: false, // Is the first time the app was started
      walletUnlocked: false, // Is the wallet unlocked
      lndReady: false, // Is lnd process running
      autopilotReady: false, // Is autopilot service running
      syncedToChain: false, // Is lnd synced to blockchain
      percentSynced: 0, // Expects 0-1 range
      route: DEFAULT_ROUTE,
      blockHeight: null,
      balanceSatoshis: 0,
      confirmedBalanceSatoshis: 0,
      unconfirmedBalanceSatoshis: 0,
      pendingBalanceSatoshis: 0,
      channelBalanceSatoshis: 0,
      network: null,
      pubKey: null,
      walletAddress: null,
      displayCopied: false,
      auth: {
        pin: '',
        newPin: '',
        pinVerify: '',
        resetPinCurrent: '',
        resetPinNew: '',
        resetPinVerify: '',
      },
      wallet: {
        password: '',
        newPassword: '',
        passwordVerify: '',
        seedVerify: ['', '', ''],
        seedIndex: 0,
        restoreIndex: 0,
        focusedRestoreInd: 0,
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
        targetConf: MED_TARGET_CONF,
        feeEstimates: [],
        fee: '',
        note: '',
        sendAll: false,
        useScanner: false,
      },
      peers: [],
      channels: [],
      pendingChannels: [],
      closedChannels: [],
      selectedChannel: null,
      channel: {
        pubkeyAtHost: '',
        amount: '',
      },
      paymentRequest: null,
      seedMnemonic: [],
      restoreSeedMnemonic: [],
      notifications: [],
      unseenNtfnCount: 0,
      logs: '',

      // Persistent data
      settings: {
        unit: DEFAULT_UNIT,
        fiat: DEFAULT_FIAT,
        displayFiat: false,
        exchangeRate: {},
        restoring: false,
        autopilot: true,
        nodeScores: {},
      },
    });
  }

  init() {
    ComputedLoaderMsg(this);
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
