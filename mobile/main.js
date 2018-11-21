/**
 * @fileOverview the main module that wires up all dependencies for mobile.
 */

import React from 'react';
import { createStackNavigator } from 'react-navigation';
import FontLoader from './component/font-loader';

import WelcomeView from '../src/view/welcome';
import LoaderView from '../src/view/loader';
import SelectSeedView from '../src/view/select-seed';
import SetPinView from '../src/view/set-pin-mobile';
import SetPinConfirmView from '../src/view/set-pin-confirm-mobile';
import SeedSuccessView from '../src/view/seed-success';
import NewAddressView from '../src/view/new-address';
import PinView from '../src/view/pin-mobile';
import LoaderSyncingView from '../src/view/loader-syncing';
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
import NotificationView from '../src/view/notification';

import {
  nav,
  wallet,
  payment,
  invoice,
  channel,
  transaction,
  setting,
  info,
  auth,
} from '../src/action/index-mobile';

import store from '../src/store';

const Welcome = () => <WelcomeView />;

const Loader = () => <LoaderView />;

const SelectSeed = () => (
  <SelectSeedView store={store} wallet={wallet} nav={nav} />
);

const SetPassword = () => <SetPinView store={store} auth={auth} nav={nav} />;

const SetPasswordConfirm = () => (
  <SetPinConfirmView store={store} auth={auth} nav={nav} />
);

const SeedSuccess = () => <SeedSuccessView wallet={wallet} />;

const NewAddress = () => (
  <NewAddressView store={store} invoice={invoice} info={info} />
);

const Password = () => <PinView store={store} auth={auth} />;

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

const Settings = () => <SettingView store={store} nav={nav} wallet={wallet} />;

const SettingsUnit = () => (
  <SettingUnitView store={store} nav={nav} setting={setting} />
);

const SettingsFiat = () => (
  <SettingFiatView store={store} nav={nav} setting={setting} />
);

const CLI = () => <CLIView store={store} nav={nav} />;

const Notifications = () => <NotificationView store={store} nav={nav} />;

const Deposit = () => <DepositView store={store} invoice={invoice} nav={nav} />;

const Invoice = () => <InvoiceView store={store} invoice={invoice} nav={nav} />;

const InvoiceQR = () => (
  <InvoiceQRView store={store} invoice={invoice} nav={nav} />
);

const Pay = () => <PaymentView store={store} payment={payment} nav={nav} />;

const MainStack = createStackNavigator(
  {
    Welcome,
    Loader,
    SelectSeed,
    SetPassword,
    SetPasswordConfirm,
    SeedSuccess,
    NewAddress,
    Password,
    LoaderSyncing,
    Wait,
    Home,
    Settings,
    SettingsUnit,
    SettingsFiat,
    Notifications,
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
