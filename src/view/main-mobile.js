/**
 * @fileOverview the main module that wires up all dependencies for mobile.
 */

import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import FontLoader from '../component/font-loader-mobile';
import NotificationWrapper from '../component/notification-wrapper';

import WelcomeView from './welcome';
import LoaderView from './loader';
import SelectSeedView from './select-seed';
import SeedIntroView from './seed-intro-mobile';
import SeedView from './seed-mobile';
import SeedVerifyView from './seed-verify-mobile';
import SetPinView from './set-pin-mobile';
import SetPinConfirmView from './set-pin-confirm-mobile';
import SeedSuccessView from './seed-success-mobile';
import RestoreSeedView from './restore-seed-mobile';
import NewAddressView from './new-address-mobile';
import SelectAutopilotView from './select-atpl-mobile';

import PinView from './pin-mobile';
import ResetPinCurrentView from './reset-pin-current-mobile';
import ResetPinNewView from './reset-pin-new-mobile';
import ResetPinConfirmView from './reset-pin-confirm-mobile';
import ResetPinSavedView from './reset-pin-saved-mobile';
import LoaderSyncingView from './loader-syncing-mobile';
import WaitView from './wait-mobile';
import HomeView from './home';
import SettingView from './setting';
import SettingUnitView from './setting-unit';
import SettingFiatView from './setting-fiat';
import CLIView from './cli';
import PaymentView from './payment-mobile';
import PayLightningConfirmView from './pay-lightning-confirm-mobile';
import PayLightningDoneView from './pay-lightning-done-mobile';
import PaymentFailedView from './payment-failed-mobile';
import PayBitcoinView from './pay-bitcoin-mobile';
import PayBitcoinConfirmView from './pay-bitcoin-confirm-mobile';
import PayBitcoinDoneView from './pay-bitcoin-done-mobile';
import InvoiceView from './invoice-mobile';
import InvoiceQRView from './invoice-qr-mobile';
import DepositView from './deposit-mobile';
import NotificationView from './notification-mobile';
import ChannelView from './channel-mobile';
import ChannelDetailView from './channel-detail-mobile';
import ChannelDeleteView from './channel-delete';
import ChannelCreateView from './channel-create-mobile';
import TransactionView from './transaction-mobile';
import TransactionDetailView from './transaction-detail-mobile';

import {
  nav,
  notify,
  wallet,
  payment,
  invoice,
  channel,
  transaction,
  setting,
  info,
  auth,
  autopilot,
  file,
} from '../action/index-mobile';

import store from '../store';

const Welcome = () => <WelcomeView />;

const Loader = () => <LoaderView />;

const SelectSeed = () => (
  <SelectSeedView store={store} wallet={wallet} setting={setting} />
);

const SeedIntro = () => <SeedIntroView nav={nav} />;

const Seed = () => <SeedView store={store} wallet={wallet} />;

const SeedVerify = () => (
  <SeedVerifyView store={store} nav={nav} wallet={wallet} />
);

const SetPassword = () => <SetPinView store={store} auth={auth} nav={nav} />;

const SetPasswordConfirm = () => (
  <SetPinConfirmView store={store} auth={auth} nav={nav} />
);

const SeedSuccess = () => <SeedSuccessView wallet={wallet} />;

const RestoreSeed = () => <RestoreSeedView store={store} wallet={wallet} />;

const NewAddress = () => (
  <NewAddressView store={store} invoice={invoice} nav={nav} />
);

const SelectAutopilot = () => (
  <SelectAutopilotView store={store} autopilot={autopilot} info={info} />
);

const Password = () => <PinView store={store} auth={auth} />;

const ResetPasswordCurrent = () => (
  <ResetPinCurrentView store={store} auth={auth} nav={nav} />
);

const ResetPasswordNew = () => <ResetPinNewView store={store} auth={auth} />;

const ResetPasswordConfirm = () => (
  <ResetPinConfirmView store={store} auth={auth} />
);

const ResetPasswordSaved = () => <ResetPinSavedView nav={nav} />;

const LoaderSyncing = () => <LoaderSyncingView store={store} />;

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

const Settings = () => (
  <SettingView store={store} nav={nav} auth={auth} autopilot={autopilot} />
);

const SettingsUnit = () => (
  <SettingUnitView store={store} nav={nav} setting={setting} />
);

const SettingsFiat = () => (
  <SettingFiatView store={store} nav={nav} setting={setting} />
);

const CLI = () => <CLIView store={store} nav={nav} file={file} />;

const Notifications = () => <NotificationView store={store} nav={nav} />;

const Deposit = () => <DepositView store={store} invoice={invoice} nav={nav} />;

const Channels = () => (
  <ChannelView store={store} channel={channel} nav={nav} />
);

const ChannelDetail = () => <ChannelDetailView store={store} nav={nav} />;

const ChannelDelete = () => (
  <ChannelDeleteView store={store} channel={channel} nav={nav} />
);

const ChannelCreate = () => (
  <ChannelCreateView store={store} channel={channel} nav={nav} />
);

const Invoice = () => <InvoiceView store={store} invoice={invoice} nav={nav} />;

const InvoiceQR = () => (
  <InvoiceQRView store={store} invoice={invoice} nav={nav} />
);

const Pay = () => <PaymentView store={store} payment={payment} nav={nav} />;

const PayLightningConfirm = () => (
  <PayLightningConfirmView store={store} payment={payment} nav={nav} />
);

const PayLightningDone = () => (
  <PayLightningDoneView payment={payment} nav={nav} />
);

const PaymentFailed = () => <PaymentFailedView channel={channel} nav={nav} />;

const PayBitcoin = () => (
  <PayBitcoinView store={store} payment={payment} nav={nav} />
);

const PayBitcoinConfirm = () => (
  <PayBitcoinConfirmView store={store} payment={payment} nav={nav} />
);

const PayBitcoinDone = () => <PayBitcoinDoneView payment={payment} nav={nav} />;

const Transactions = () => (
  <TransactionView store={store} transaction={transaction} nav={nav} />
);

const TransactionDetail = () => (
  <TransactionDetailView store={store} nav={nav} />
);

const stackOptions = {
  headerMode: 'none',
};

const MainStack = createStackNavigator(
  {
    Welcome,
    Wait,
    Loader,
    SelectSeed,
    SeedIntro,
    Seed,
    SeedVerify,
    SetPassword,
    SetPasswordConfirm,
    SeedSuccess,
    RestoreSeed,
    NewAddress,
    SelectAutopilot,
    Password,
    LoaderSyncing,
    Home,
  },
  stackOptions
);

const InvoiceStack = createStackNavigator(
  {
    Invoice,
    InvoiceQR,
  },
  stackOptions
);

const PayStack = createStackNavigator(
  {
    Pay,
    PayLightningConfirm,
    Wait,
    PayLightningDone,
    PaymentFailed,
    PayBitcoin,
    PayBitcoinConfirm,
    PayBitcoinDone,
  },
  stackOptions
);

const TransactionStack = createStackNavigator(
  {
    Transactions,
    TransactionDetail,
  },
  stackOptions
);

const ChannelStack = createStackNavigator(
  {
    Channels,
    ChannelDetail,
    ChannelDelete,
    ChannelCreate,
  },
  stackOptions
);

const SettingStack = createStackNavigator(
  {
    Settings,
    SettingsUnit,
    SettingsFiat,
    ResetPasswordCurrent,
    ResetPasswordNew,
    ResetPasswordConfirm,
    ResetPasswordSaved,
    CLI,
    Notifications,
  },
  stackOptions
);

const RootStack = createStackNavigator(
  {
    Main: MainStack,
    Invoice: InvoiceStack,
    Pay: PayStack,
    Transactions: TransactionStack,
    Channels: ChannelStack,
    Settings: SettingStack,
    Deposit,
  },
  {
    ...stackOptions,
    mode: 'modal',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return (
      <FontLoader>
        <NotificationWrapper store={store} notify={notify}>
          <AppContainer ref={navRef => nav.setTopLevelNavigator(navRef)} />
        </NotificationWrapper>
      </FontLoader>
    );
  }
}
