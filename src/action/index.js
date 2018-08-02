/**
 * @fileOverview this is the main action module where all actions are initilized
 * by injecting dependencies and then triggering startup actions when certain
 * flags on the global store are set to true.
 */

import { observe } from 'mobx';
import { AsyncStorage, Clipboard } from 'react-native';
import { nap } from '../helper';
import store from '../store';
import AppStorage from './app-storage';
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

const ipcRenderer = window.ipcRenderer; // exposed to sandbox via preload.js

//
// Inject dependencies
//

store.init(); // initialize computed values

export const db = new AppStorage(store, AsyncStorage);
export const log = new LogAction(store, ipcRenderer);
export const nav = new NavAction(store);
export const grpc = new GrpcAction(store, ipcRenderer);
export const notify = new NotificationAction(store, nav);
export const wallet = new WalletAction(store, grpc, db, nav, notify);
export const info = new InfoAction(store, grpc, nav, notify);
export const channel = new ChannelAction(store, grpc, nav, notify);
export const transaction = new TransactionAction(store, grpc, wallet, nav);
export const invoice = new InvoiceAction(
  store,
  grpc,
  transaction,
  nav,
  notify,
  Clipboard
);
export const payment = new PaymentAction(store, grpc, transaction, nav, notify);
export const setting = new SettingAction(store, wallet, db, ipcRenderer);

payment.listenForUrl(ipcRenderer); // enable incoming url handler

//
// Init actions
//

db.restore(); // read user settings from disk

/**
 * Triggered after user settings are restored from disk.
 */
observe(store, 'loaded', async () => {
  await grpc.initUnlocker();
});

/**
 * Triggered after the wallet unlocker grpc client is initialized.
 */
observe(store, 'unlockerReady', async () => {
  await wallet.init();
});

/**
 * Triggered after the user's password has unlocked the wallet.
 */
observe(store, 'walletUnlocked', async () => {
  await nap();
  await grpc.closeUnlocker();
  await grpc.initLnd();
});

/**
 * Triggered once the main lnd grpc client is inialized. This is when
 * the user can really begin to interact with the application and calls
 * to and from lnd can be done. The display the current state of the
 * lnd node all balances, channels and transactions are fetched.
 */
observe(store, 'lndReady', () => {
  setting.getLocale();
  info.getInfo();
  wallet.update();
  channel.update();
  transaction.update();
  transaction.subscribeTransactions();
  transaction.subscribeInvoices();
});
