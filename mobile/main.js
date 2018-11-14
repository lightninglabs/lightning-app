/**
 * @fileOverview the main module that wires up all dependencies for mobile.
 */

import React from 'react';
import {
  Clipboard,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import { SecureStore, LocalAuthentication } from 'expo';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import FontLoader from './component/font-loader';

import SelectSeedView from '../src/view/select-seed';
import SetPinView from '../src/view/set-pin-mobile';
import SetPinConfirmView from '../src/view/set-pin-confirm-mobile';
import SeedSuccessView from '../src/view/seed-success';
import NewAddressView from '../src/view/new-address';

import PinView from '../src/view/pin-mobile';
import WaitView from '../src/view/wait-mobile';
import HomeView from '../src/view/home';
import SettingView from '../src/view/setting';
import SettingUnitView from '../src/view/setting-unit';
import SettingFiatView from '../src/view/setting-fiat';
import CLIView from '../src/view/cli';
import PaymentView from '../src/view/payment';
import InvoiceView from '../src/view/invoice';
import InvoiceQRView from '../src/view/invoice-qr';
import DepositView from '../src/view/deposit';

import sinon from 'sinon';
import { Store } from '../src/store';
import NavAction from '../src/action/nav-mobile';
import GrpcAction from '../src/action/grpc-mobile';
/* import InfoAction from '../src/action/info'; */
import AppStorage from '../src/action/app-storage';
import NotificationAction from '../src/action/notification';
import SettingAction from '../src/action/setting';
import WalletAction from '../src/action/wallet';
import InvoiceAction from '../src/action/invoice';
import PaymentAction from '../src/action/payment';
import ChannelAction from '../src/action/channel';
import TransactionAction from '../src/action/transaction';
import AuthAction from '../src/action/auth-mobile';

const store = new Store();
store.init();
const nav = new NavAction(store, NavigationActions);
const db = sinon.createStubInstance(AppStorage);
const grpc = new GrpcAction(store, NativeModules, NativeEventEmitter);
/* const info = sinon.createStubInstance(InfoAction); */
const notify = sinon.createStubInstance(NotificationAction);
const wallet = new WalletAction(store, grpc, db, nav, notify);
const setting = new SettingAction(store, wallet, db, { send: sinon.stub() });
sinon.stub(wallet, 'update');
sinon.stub(wallet, 'checkSeed');
sinon.stub(wallet, 'getExchangeRate');
const transaction = new TransactionAction(store, grpc, nav, notify);
sinon.stub(transaction, 'update');
const invoice = new InvoiceAction(store, grpc, nav, notify, Clipboard);
sinon.stub(invoice, 'generateUri');
const payment = new PaymentAction(store, grpc, nav, notify);
sinon.stub(payment, 'checkType');
sinon.stub(payment, 'payBitcoin');
sinon.stub(payment, 'payLightning');
const channel = new ChannelAction(store, grpc, nav, notify);
sinon.stub(channel, 'update');
sinon.stub(channel, 'connectAndOpen');
sinon.stub(channel, 'closeSelectedChannel');

const auth = new AuthAction(
  store,
  wallet,
  nav,
  SecureStore,
  LocalAuthentication,
  Alert
);

const SelectSeed = () => (
  <SelectSeedView store={store} wallet={wallet} nav={nav} />
);

const SetPin = () => <SetPinView store={store} auth={auth} nav={nav} />;

const SetPinConfirm = () => (
  <SetPinConfirmView store={store} auth={auth} nav={nav} />
);

const SeedSuccess = () => <SeedSuccessView wallet={wallet} />;

const NewAddress = () => (
  <NewAddressView
    store={store}
    invoice={invoice}
    info={{ initLoaderSyncing: () => nav.goHome() }}
  />
);

const Pin = () => <PinView store={store} auth={auth} />;

const Wait = () => <WaitView />;

const Home = () => (
  <HomeView
    store={store}
    wallet={wallet}
    channel={channel}
    payment={payment}
    invoice={invoice}
    transaction={transaction}
    nav={nav}
  />
);

const Settings = () => <SettingView store={store} nav={nav} wallet={wallet} />;

const SettingsUnit = () => (
  <SettingUnitView store={store} nav={nav} setting={setting} />
);

const SettingsFiat = () => (
  <SettingFiatView store={store} nav={nav} setting={setting} />
);

const CLI = () => <CLIView store={store} nav={nav} />;

const Deposit = () => <DepositView store={store} invoice={invoice} nav={nav} />;

const Invoice = () => <InvoiceView store={store} invoice={invoice} nav={nav} />;

const InvoiceQR = () => (
  <InvoiceQRView store={store} invoice={invoice} nav={nav} />
);

const Pay = () => <PaymentView store={store} payment={payment} nav={nav} />;

const MainStack = createStackNavigator(
  {
    SelectSeed,
    SetPin,
    SetPinConfirm,
    SeedSuccess,
    NewAddress,
    Pin,
    Wait,
    Home,
    Settings,
    SettingsUnit,
    SettingsFiat,
    CLI,
  },
  {
    headerMode: 'none',
  }
);

const InvoiceStack = createStackNavigator(
  {
    Invoice,
    InvoiceQR,
  },
  {
    headerMode: 'none',
  }
);

const PayStack = createStackNavigator(
  {
    Pay,
  },
  {
    headerMode: 'none',
  }
);

const RootStack = createStackNavigator(
  {
    Main: MainStack,
    Invoice: InvoiceStack,
    Pay: PayStack,
    Deposit,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <FontLoader>
        <RootStack ref={navRef => nav.setTopLevelNavigator(navRef)} />
      </FontLoader>
    );
  }
}

// set some dummy data
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
