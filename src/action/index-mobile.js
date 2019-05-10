/**
 * @fileOverview this is the main action module for mobile where all actions
 * are initilized by injecting dependencies and then triggering startup actions
 * when certain flags on the global store are set to true.
 */

import sinon from 'sinon';

import { when } from 'mobx';
import {
  Alert,
  Linking,
  Clipboard,
  // AsyncStorage,
  // NativeModules,
  // NativeEventEmitter,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { NavigationActions, StackActions } from 'react-navigation';
import { nap } from '../helper';
import store from '../store';
import AppStorage from './app-storage';
import IpcAction from './ipc-mobile';
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
import AtplAction from './autopilot';

//
// Inject dependencies
//

store.init(); // initialize computed values

// export const db = new AppStorage(store, AsyncStorage);
export const db = sinon.createStubInstance(AppStorage); // STUB DURING DEVELOPMENT
// export const grpc = new GrpcAction(store, NativeModules, NativeEventEmitter);
export const grpc = sinon.createStubInstance(GrpcAction); // STUB DURING DEVELOPMENT
// export const ipc = new IpcAction(grpc);
export const ipc = sinon.createStubInstance(IpcAction); // STUB DURING DEVELOPMENT
export const log = new LogAction(store, ipc, false);
export const nav = new NavAction(store, NavigationActions, StackActions);
export const notify = new NotificationAction(store, nav);
export const wallet = new WalletAction(store, grpc, db, nav, notify);
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
  SecureStore,
  LocalAuthentication,
  Alert
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

// STUB DURING DEVELOPMENT
sinon.stub(wallet, 'update');
sinon.stub(wallet, 'getExchangeRate');
sinon.stub(transaction, 'update');
sinon.stub(invoice, 'generateUri');
sinon.stub(payment, 'checkType');
sinon.stub(payment, 'payBitcoin');
sinon.stub(payment, 'payLightning');
sinon.stub(channel, 'update');
sinon.stub(channel, 'connectAndOpen');
sinon.stub(channel, 'closeSelectedChannel');
sinon.stub(autopilot, 'toggle');

// SET SOME DUMMY DATA DURING DEVELOPMENT
setTimeout(
  () => (store.walletAddress = 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K'),
  3000
);
store.balanceSatoshis = 76543;
store.pendingBalanceSatoshis = 800000;
store.channelBalanceSatoshis = 598760;
store.settings.exchangeRate.usd = 0.00016341;
store.settings.exchangeRate.eur = 0.0001896;
store.settings.exchangeRate.gbp = 0.00021405;
store.invoice.amount = '0.45678';
store.invoice.note = 'For the love of bitcoin';
store.invoice.encoded =
  'lnbc4567800n1pdvqx48pp5eng6uyqnkdlx93m2598ug93qtuls8gapygxznshzd56h7n5cxs0sdp9gehhygr5dpjjqmr0wejjqmmxyp3xjarrda5kucqzysmhyrleqpt3yqf5nctzsr3hvrv9vhhnawazkwyzu8t4mf85tllsyjsf8hgu5nt6dj3jaljjgmt999xnlsweqvatypzlu34nhpjlxf59qp4dn2pv';
store.invoice.uri = `lightning:${store.invoice.encoded}`;
store.channels = [...Array(4)].map(() => ({
  remotePubkey:
    '0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38',
  id: '1337006139441152',
  fundingTxId: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  capacity: 2005000,
  localBalance: 1990000,
  remoteBalance: 10000,
  commitFee: 0,
  channelPoint:
    '3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275',
  active: true,
  status: 'open',
}));
store.pendingChannels = [...Array(6)].map((x, i) => ({
  remotePubkey:
    '0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38',
  id: '1337006139441152',
  fundingTxId: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  capacity: 1005000,
  localBalance: 600000,
  remoteBalance: 400000,
  commitFee: 0,
  channelPoint:
    '3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275',
  status: i % 2 === 0 ? 'pending-closing' : 'pending-open',
}));
store.closedChannels = [...Array(4)].map(() => ({
  remotePubkey:
    '0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38',
  fundingTxId: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  closingTxId:
    'd8413966f01ac4d288d87b8b6f2057aed07ceccb318a94f1319b1b2cc7876f4a',
  capacity: 2005000,
  localBalance: 1990000,
  remoteBalance: 10000,
  channelPoint:
    '3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275',
  status: 'closed',
}));
store.percentSynced = 0.85;
store.transactions = [...Array(5)].map((x, i) => ({
  id: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  type: 'bitcoin',
  amount: 923456,
  fee: 8250,
  confirmations: i % 2 === 0 ? 0 : 6,
  status: i % 2 === 0 ? 'unconfirmed' : 'confirmed',
  date: new Date(),
}));
store.invoices = [...Array(1)].map(() => ({
  id: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  type: 'lightning',
  amount: 81345,
  status: 'in-progress',
  date: new Date(),
}));
store.selectedTransaction = (store.computedTransactions || []).find(
  tx => tx.type === 'bitcoin'
);
store.selectedChannel = store.computedChannels && store.computedChannels[0];
store.seedMnemonic = [
  'empower',
  'neglect',
  'experience',
  'elevator',
  'entropy',
  'future',
  'trust',
  'swift',
  'pluck',
  'easy',
  'kite',
  'measure',
  'engage',
  'settle',
  'dog',
  'manager',
  'tool',
  'fan',
  'neglect',
  'conduct',
  'blouse',
  'stone',
  'quit',
  'cashew',
];
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
