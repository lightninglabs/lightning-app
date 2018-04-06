import React from 'react';
import { storiesOf } from '@storybook/react';
import sinon from 'sinon';
import WelcomeView from '../src/view/welcome';
import TransactionView from '../src/view/transaction';
import HomeView from '../src/view/home';
import { Store } from '../src/store';
import WalletAction from '../src/action/wallet';
import NavAction from '../src/action/nav';
import PaymentRequest from '../src/view/payment-request';

const store = new Store();
const wallet = new WalletAction(store);
const nav = sinon.createStubInstance(NavAction);

storiesOf('Screens', module)
  .add('Welcome', () => <WelcomeView />)
  .add('Transactions', () => <TransactionView store={store} />)
  .add('Home', () => <HomeView store={store} wallet={wallet} nav={nav} />)
  .add('Payment Request', () => <PaymentRequest store={store} />);

// set some dummy data
store.balanceSatoshis = 798765432;
store.channelBalanceSatoshis = 59876000;
store.settings.exchangeRate.usd = 0.00014503;
store.transactions = [...Array(100)].map((x, i) => ({
  id: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  type: i % 2 === 0 ? 'lightning' : 'bitcoin',
  amount: '923456',
  status: i % 2 === 0 ? 'Complete' : 'Unconfirmed',
  date: new Date(),
  fee: '156',
}));
store.paymentRequest = {
  amount: "456,780",
  invoice: "lnbc4567800n1pdvqx48pp5eng6uyqnkdlx93m2598ug93qtuls8gapygxznshzd56h7n5cxs0sdp9gehhygr5dpjjqmr0wejjqmmxyp3xjarrda5kucqzysmhyrleqpt3yqf5nctzsr3hvrv9vhhnawazkwyzu8t4mf85tllsyjsf8hgu5nt6dj3jaljjgmt999xnlsweqvatypzlu34nhpjlxf59qp4dn2pv",
  message: "For the love of bitcoin",
}
