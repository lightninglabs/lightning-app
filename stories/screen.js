import React from 'react';
import { storiesOf } from '@storybook/react';
import WelcomeView from '../src/view/welcome';
import HomeView from '../src/view/home';
import { Store } from '../src/store';

const store = new Store();

storiesOf('Screens', module)
  .add('Welcome', () => <WelcomeView />)
  .add('Home', () => <HomeView store={store} />);

// set some dummy data
store.settings.unit = 'bit';
store.channelBalanceSatoshis = 59876543;
store.settings.exchangeRate.usd = 0.00014503;
store.settings.displayFiat = true;
