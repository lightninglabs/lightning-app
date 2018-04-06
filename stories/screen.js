import React from 'react';
import { storiesOf } from '@storybook/react';
import sinon from 'sinon';
import WelcomeView from '../src/view/welcome';
import HomeView from '../src/view/home';
import { Store } from '../src/store';
import WalletAction from '../src/action/wallet';
import NavAction from '../src/action/nav';

const store = new Store();
const wallet = new WalletAction(store);
const nav = sinon.createStubInstance(NavAction);

storiesOf('Screens', module)
  .add('Welcome', () => <WelcomeView />)
  .add('Home', () => <HomeView store={store} wallet={wallet} nav={nav} />);

// set some dummy data
store.balanceSatoshis = 798765432;
store.channelBalanceSatoshis = 59876543;
store.settings.exchangeRate.usd = 0.00014503;
