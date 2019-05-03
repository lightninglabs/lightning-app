/**
 * @fileOverview this is the main action module where all actions are initilized
 * by injecting dependencies and then triggering startup actions when certain
 * flags on the global store are set to true.
 */

import { when } from 'mobx';
import { AsyncStorage, Clipboard } from 'react-native';
import { nap } from '../helper';
import store from '../store';
import AppStorage from './app-storage';
import IpcAction from './ipc';
import GrpcAction from './grpc';
import NavAction from './nav';
import WalletAction from './wallet';
import LogAction from './log';
import InfoAction from './info';
import NotificationAction from './notification';
import ChannelAction from './channel';
import TransactionAction from './transaction';
import PaymentAction from './payment';
import InvoiceAction from './invoice';
import SettingAction from './setting';
import AtplAction from './autopilot';

//
// Inject dependencies
//

store.init(); // initialize computed values

export const ipc = new IpcAction(window.ipcRenderer);
export const db = new AppStorage(store, AsyncStorage);
export const log = new LogAction(store, ipc);
export const nav = new NavAction(store);
export const grpc = new GrpcAction(store, ipc);
export const notify = new NotificationAction(store, nav);
export const wallet = new WalletAction(store, grpc, db, nav, notify);
export const info = new InfoAction(store, grpc, nav, notify);
export const transaction = new TransactionAction(store, grpc, nav, notify);
export const channel = new ChannelAction(store, grpc, nav, notify);
export const invoice = new InvoiceAction(store, grpc, nav, notify, Clipboard);
export const payment = new PaymentAction(store, grpc, nav, notify, Clipboard);
export const setting = new SettingAction(store, wallet, db, ipc);
export const autopilot = new AtplAction(store, grpc, db, notify);

payment.listenForUrl(ipc); // enable incoming url handler

//
// Init actions
//

db.restore(); // read user settings from disk

/**
 * Triggered after user settings are restored from disk.
 */
when(() => store.loaded, () => grpc.initUnlocker());

/**
 * Triggered after the wallet unlocker grpc client is initialized.
 */
when(() => store.unlockerReady, () => wallet.init());

/**
 * Triggered the first time the app was started e.g. to set the
 * local fiat currency only once.
 */
when(() => store.firstStart, () => setting.detectLocalCurrency());

/**
 * Triggered after the user's password has unlocked the wallet
 * or a user's password has been successfully reset.
 */
when(
  () => store.walletUnlocked,
  async () => {
    await nap();
    await grpc.closeUnlocker();
    await grpc.initLnd();
    await grpc.initAutopilot();
  }
);

/**
 * Triggered once the main lnd grpc client is initialized. This is when
 * the user can really begin to interact with the application and calls
 * to and from lnd can be done. The display the current state of the
 * lnd node all balances, channels and transactions are fetched.
 */
when(
  () => store.lndReady,
  () => {
    wallet.pollBalances();
    wallet.pollExchangeRate();
    channel.pollChannels();
    transaction.update();
    transaction.subscribeTransactions();
    transaction.subscribeInvoices();
    info.pollInfo();
  }
);

/**
 * Initialize autopilot after syncing is finished and the grpc client
 * is ready
 */
when(
  () => store.syncedToChain && store.network && store.autopilotReady,
  async () => {
    await nap();
    autopilot.init();
  }
);
