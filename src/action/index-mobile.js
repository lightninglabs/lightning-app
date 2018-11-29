/**
 * @fileOverview this is the main action module for mobile where all actions
 * are initilized by injecting dependencies and then triggering startup actions
 * when certain flags on the global store are set to true.
 */

import sinon from 'sinon';

import { observe, when } from 'mobx';
import {
  Alert,
  Clipboard,
  // AsyncStorage,
  // NativeModules,
  // NativeEventEmitter,
} from 'react-native';
import { SecureStore, LocalAuthentication, Linking } from 'expo';
import { NavigationActions } from 'react-navigation';
import store from '../store';
import AppStorage from './app-storage';
import GrpcAction from './grpc-mobile';
import NavAction from './nav-mobile';
import WalletAction from './wallet';
import LogAction from './log';
import InfoAction from './info';
import NotificationAction from './notification';
import ChannelAction from './channel';
import TransactionAction from './transaction';
import PaymentAction from './payment';
import InvoiceAction from './invoice';
import SettingAction from './setting';
import AuthAction from './auth-mobile';

//
// Inject dependencies
//

store.init(); // initialize computed values

export const ipc = { send: () => {}, listen: () => {} };
// export const db = new AppStorage(store, AsyncStorage);
export const db = sinon.createStubInstance(AppStorage); // STUB DURING DEVELOPMENT
export const log = new LogAction(store, ipc);
export const nav = new NavAction(store, NavigationActions);
// export const grpc = new GrpcAction(store, NativeModules, NativeEventEmitter);
export const grpc = sinon.createStubInstance(GrpcAction); // STUB DURING DEVELOPMENT
export const notify = new NotificationAction(store, nav);
export const wallet = new WalletAction(store, grpc, db, nav, notify);
export const info = new InfoAction(store, grpc, nav, notify);
export const transaction = new TransactionAction(store, grpc, nav, notify);
export const channel = new ChannelAction(store, grpc, nav, notify);
export const invoice = new InvoiceAction(store, grpc, nav, notify, Clipboard);
export const payment = new PaymentAction(store, grpc, nav, notify);
export const setting = new SettingAction(store, wallet, db, ipc);
export const auth = new AuthAction(
  store,
  wallet,
  nav,
  SecureStore,
  LocalAuthentication,
  Alert
);

payment.listenForUrlMobile(Linking); // enable incoming url handler

//
// Init actions
//

db.restore(); // read user settings from disk

/**
 * Triggered after user settings are restored from disk and the
 * navigator is ready.
 */
when(
  () => store.loaded && store.navReady,
  async () => {
    nav.goWait();
    await grpc.initUnlocker();
  }
);

/**
 * Triggered after the wallet unlocker grpc client is initialized.
 */
observe(store, 'unlockerReady', async () => {
  store.walletUnlocked = true;
});

/**
 * Triggered after the user's password has unlocked the wallet
 * or a user's password has been successfully reset.
 */
observe(store, 'walletUnlocked', async () => {
  if (!store.walletUnlocked) return;
  await grpc.initLnd();
});

/**
 * Triggered once the main lnd grpc client is initialized. This is when
 * the user can really begin to interact with the application and calls
 * to and from lnd can be done. The display the current state of the
 * lnd node all balances, channels and transactions are fetched.
 */
observe(store, 'lndReady', () => {
  if (!store.lndReady) return;
  nav.goHome();
  info.pollInfo();
  wallet.getNewAddress();
  wallet.pollBalances();
  wallet.pollExchangeRate();
  channel.update();
  transaction.update();
});

// STUB DURING DEVELOPMENT
sinon.stub(wallet, 'update');
sinon.stub(wallet, 'checkSeed');
sinon.stub(wallet, 'getExchangeRate');
sinon.stub(transaction, 'update');
sinon.stub(invoice, 'generateUri');
sinon.stub(payment, 'checkType');
sinon.stub(payment, 'payBitcoin');
sinon.stub(payment, 'payLightning');
sinon.stub(channel, 'update');
sinon.stub(channel, 'connectAndOpen');
sinon.stub(channel, 'closeSelectedChannel');

// SET SOME DUMMY DATA DURING DEVELOPMENT
store.walletAddress = 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K';
store.balanceSatoshis = 798765432;
store.pendingBalanceSatoshis = 100000000;
store.channelBalanceSatoshis = 59876000;
store.settings.exchangeRate.usd = 0.00016341;
store.settings.exchangeRate.eur = 0.0001896;
store.settings.exchangeRate.gbp = 0.00021405;
store.logs = [
  '[14:00:24.995] [info] Using lnd in path lnd',
  'Checking for update',
  '[14:00:25.047] [info] lnd: 2018-06-28 14:00:25.039 [WRN] LTND: open /home/valentine/.config/lightning-app/lnd/lnd.conf: no such file or directory',
  '2018-06-28 14:00:25.039 [INF] LTND: Version 0.4.2-beta commit=884c51dfdc85284ba8d063c4547d2b5665eba010',
  '2018-06-28 14:00:25.039 [INF] LTND: Active chain: Bitcoin (network=testnet)',
  '2018-06-28 14:00:25.039 [INF] CHDB: Checking for schema update: latest_version=1, db_version=1',
  '[14:00:25.170] [info] lnd: 2018-06-28 14:00:25.055 [INF] RPCS: password RPC server listening on 127.0.0.1:10009',
  '2018-06-28 14:00:25.055 [INF] RPCS: password gRPC proxy started at 127.0.0.1:8080',
  '2018-06-28 14:00:25.055 [INF] LTND: Waiting for wallet encryption password. Use `lncli create` to create a wallet, `lncli unlock` to unlock an existing wallet, or `lncli changepassword` to change the password of an existing wallet and unlock it.',
  '[14:00:25.541] [info] Loaded initial state',
  '[14:00:25.557] [info] GRPC unlockerReady',
  'Found version 0.2.0-prealpha.9 (url: Lightning-linux-x86_64v0.2.0-prealpha.9.AppImage)',
  'Downloading update from Lightning-linux-x86_64v0.2.0-prealpha.9.AppImage',
  'No cached update available',
  'File has 2893 changed blocks',
  'Full: 106,265.24 KB, To download: 59,575.39 KB (56%)',
  'Differential download: https://github.com/lightninglabs/lightning-app/releases/download/v0.2.0-prealpha.9/Lightning-linux-x86_64v0.2.0-prealpha.9.AppImage',
  'Redirect to https://github-production-release-asset-2e65be.s3.amazonaws.com/76898197/428914b4-7561-11e8-8826-08fde1bd29aa',
  '[14:00:33.730] [info] lnd: 2018-06-28 14:00:33.730 [INF] LNWL: Opened wallet',
  '[14:00:33.731] [info] lnd: 2018-06-28 14:00:33.730 [INF] LTND: Primary chain is set to: bitcoin',
  '[14:00:33.879] [info] lnd: 2018-06-28 14:00:33.879 [INF] BTCN: Loaded 1032 addresses from file /home/valentine/.config/lightning-app/lnd/data/chain/bitcoin/testnet/peers.json',
  '[14:00:33.893] [info] lnd: 2018-06-28 14:00:33.892 [INF] CMGR: DNS discovery failed on seed x49.seed.tbtc.petertodd.org: lookup x49.seed.tbtc.petertodd.org: No address associated with hostname',
].join('\n');
