import React from 'react';
import { storiesOf } from '@storybook/react';
import sinon from 'sinon';
import { Store } from '../src/store';
import NavAction from '../src/action/nav';
import GrpcAction from '../src/action/grpc';
import NotificationAction from '../src/action/notification';
import WalletAction from '../src/action/wallet';
import InvoiceAction from '../src/action/invoice';
import Welcome from '../src/view/welcome';
import Transaction from '../src/view/transaction';
import Home from '../src/view/home';
import Deposit from '../src/view/deposit';
import Invoice from '../src/view/invoice';
import InvoiceQR from '../src/view/invoice-qr';

const store = new Store();
const nav = sinon.createStubInstance(NavAction);
const grpc = sinon.createStubInstance(GrpcAction);
const notification = sinon.createStubInstance(NotificationAction);
const wallet = new WalletAction(store, grpc, notification);
const invoice = new InvoiceAction(store, grpc, nav, notification);
sinon.stub(invoice, 'generateUri');

storiesOf('Screens', module)
  .add('Welcome', () => <Welcome />)
  .add('Home', () => (
    <Home store={store} wallet={wallet} invoice={invoice} nav={nav} />
  ))
  .add('Transactions', () => <Transaction store={store} nav={nav} />)
  .add('Deposit', () => <Deposit store={store} nav={nav} />)
  .add('Invoice', () => <Invoice store={store} invoice={invoice} nav={nav} />)
  .add('Invoice QR', () => <InvoiceQR store={store} nav={nav} />);

// set some dummy data
store.walletAddress = 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K';
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
store.invoice = {
  amount: '0.45678',
  note: 'For the love of bitcoin',
  encoded:
    'lnbc4567800n1pdvqx48pp5eng6uyqnkdlx93m2598ug93qtuls8gapygxznshzd56h7n5cxs0sdp9gehhygr5dpjjqmr0wejjqmmxyp3xjarrda5kucqzysmhyrleqpt3yqf5nctzsr3hvrv9vhhnawazkwyzu8t4mf85tllsyjsf8hgu5nt6dj3jaljjgmt999xnlsweqvatypzlu34nhpjlxf59qp4dn2pv',
  uri: `lightning:${this.encoded}`,
};
