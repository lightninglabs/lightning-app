/**
 * @fileOverview this is the main action module for mobile where all actions
 * are initilized by injecting dependencies and then triggering startup actions
 * when certain flags on the global store are set to true.
 */

import { when } from 'mobx';
import {
  Alert,
  Linking,
  Platform,
  Clipboard,
  AsyncStorage,
  NativeModules,
  ActionSheetIOS,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import * as Random from 'expo-random';
import * as LocalAuthentication from 'expo-local-authentication';
import * as RNKeychain from 'react-native-keychain';
import RNFS from 'react-native-fs';
import RNShare from 'react-native-share';
import RNDeviceInfo from 'react-native-device-info';
import RNiCloudStorage from 'react-native-icloudstore';
import { NavigationActions, StackActions } from 'react-navigation';
import { nap } from '../helper';
import store from '../store';
import { LND_NETWORK } from '../config';
import AppStorage from './app-storage';
import IpcAction from './ipc-mobile';
import GrpcAction from './grpc-mobile';
import NavAction from './nav-mobile';
import WalletAction from './wallet';
import LogAction from './log';
import FileAction from './file-mobile';
import KeychainAction from './keychain-mobile';
import BackupAction from './backup-mobile';
import InfoAction from './info';
import NotificationAction from './notification';
import ChannelAction from './channel';
import TransactionAction from './transaction';
import PaymentAction from './payment';
import InvoiceAction from './invoice';
import SettingAction from './setting';
import AuthAction from './auth-mobile';
import AtplAction from './autopilot';

//
// Inject dependencies
//

store.network = LND_NETWORK; // set to read SCB file for restore
store.init(); // initialize computed values

export const db = new AppStorage(store, AsyncStorage);
export const grpc = new GrpcAction(store, NativeModules, NativeEventEmitter);
export const keychain = new KeychainAction(RNKeychain);
export const ipc = new IpcAction(grpc);
export const file = new FileAction(store, RNFS, RNShare);
export const log = new LogAction(store, ipc, false);
export const nav = new NavAction(store, NavigationActions, StackActions);
export const notify = new NotificationAction(store, nav);
export const backup = new BackupAction(
  grpc,
  file,
  Platform,
  RNDeviceInfo,
  PermissionsAndroid,
  RNiCloudStorage
);
export const wallet = new WalletAction(
  store,
  grpc,
  db,
  nav,
  notify,
  file,
  backup
);
export const info = new InfoAction(store, grpc, nav, notify);
export const transaction = new TransactionAction(store, grpc, nav, notify);
export const channel = new ChannelAction(store, grpc, nav, notify);
export const invoice = new InvoiceAction(store, grpc, nav, notify, Clipboard);
export const payment = new PaymentAction(store, grpc, nav, notify, Clipboard);
export const setting = new SettingAction(store, wallet, db, ipc);
export const auth = new AuthAction(
  store,
  wallet,
  nav,
  Random,
  keychain,
  LocalAuthentication,
  Alert,
  ActionSheetIOS,
  Platform
);
export const autopilot = new AtplAction(store, grpc, db, notify);

payment.listenForUrlMobile(Linking); // enable incoming url handler

//
// Init actions
//

db.restore(); // read user settings from disk

/**
 * Triggered after user settings are restored from disk and the
 * navigator is ready.
 */
when(() => store.loaded && store.navReady, () => grpc.initUnlocker());

/**
 * Triggered after the wallet unlocker grpc client is initialized.
 */
when(() => store.unlockerReady, () => wallet.init());

/**
 * Triggered after the user's password has unlocked the wallet
 * or a user's password has been successfully reset.
 */
when(
  () => store.walletUnlocked,
  async () => {
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
 * Keep the Static Channel Backup (SCB) synced to external storage once
 * lnd ready and has set the `network` attribute upon polling `getInfo`.
 */
when(
  () => store.network && store.syncedToChain,
  async () => {
    backup.pushChannelBackup();
    backup.subscribeChannelBackups();
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
