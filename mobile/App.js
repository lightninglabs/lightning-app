import 'node-libs-react-native/globals';
// import Storybook from './storybook';
// export default Storybook;

import React from 'react';
import { Button, View, Text, Clipboard } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import FontLoader from './component/font-loader';

import Home from '../src/view/home';
import Setting from '../src/view/setting';

import sinon from 'sinon';
import { Store } from '../src/store';
import NavAction from '../src/action/nav-mobile';
import IpcAction from '../src/action/ipc';
import GrpcAction from '../src/action/grpc';
import InfoAction from '../src/action/info';
import AppStorage from '../src/action/app-storage';
import NotificationAction from '../src/action/notification';
import SettingAction from '../src/action/setting';
import WalletAction from '../src/action/wallet';
import InvoiceAction from '../src/action/invoice';
import PaymentAction from '../src/action/payment';
import ChannelAction from '../src/action/channel';
import TransactionAction from '../src/action/transaction';

const store = new Store();
store.init();
const nav = new NavAction(store);
const db = sinon.createStubInstance(AppStorage);
const ipc = sinon.createStubInstance(IpcAction);
const grpc = sinon.createStubInstance(GrpcAction);
const info = sinon.createStubInstance(InfoAction);
const notify = sinon.createStubInstance(NotificationAction);
const wallet = new WalletAction(store, grpc, db, nav, notify);
const setting = new SettingAction(store, wallet, db, ipc);
sinon.stub(wallet, 'update');
sinon.stub(wallet, 'checkSeed');
sinon.stub(wallet, 'checkNewPassword');
sinon.stub(wallet, 'checkPassword');
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

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <Home
          store={store}
          wallet={wallet}
          channel={channel}
          payment={payment}
          invoice={invoice}
          transaction={transaction}
          nav={nav}
        />
      </View>
    );
  }
}

class SettingScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <Setting store={store} nav={nav} />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    /* 2. Get the param, provide a fallback value if not available */
    const { navigation } = this.props;
    const store = navigation.getParam('store', {});
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>itemId: {store.itemId}</Text>
        <Text>otherParam: {store.otherParam}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => navigation.push('MyModal')}
        />
      </View>
    );
  }
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Settings: {
      screen: SettingScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    headerMode: 'none',
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: ModalScreen,
    },
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
