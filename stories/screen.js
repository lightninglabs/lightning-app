import React from 'react';
import { storiesOf } from '@storybook/react';
import sinon from 'sinon';
import { Store } from '../src/store';
import NavAction from '../src/action/nav';
import GrpcAction from '../src/action/grpc';
import NotificationAction from '../src/action/notification';
import WalletAction from '../src/action/wallet';
import InvoiceAction from '../src/action/invoice';
import PaymentAction from '../src/action/payment';
import Welcome from '../src/view/welcome';
import Transaction from '../src/view/transaction';
import Home from '../src/view/home';
import Deposit from '../src/view/deposit';
import Invoice from '../src/view/invoice';
import InvoiceQR from '../src/view/invoice-qr';
import Payment from '../src/view/payment';
import PayLightningConfirm from '../src/view/pay-lightning-confirm';
import PayBitcoin from '../src/view/pay-bitcoin';
import PayBitcoinConfirm from '../src/view/pay-bitcoin-confirm';

const store = new Store();
const nav = sinon.createStubInstance(NavAction);
const grpc = sinon.createStubInstance(GrpcAction);
const notify = sinon.createStubInstance(NotificationAction);
const wallet = new WalletAction(store, grpc, notify);
const invoice = new InvoiceAction(store, grpc, nav, notify);
sinon.stub(invoice, 'generateUri');
const payment = new PaymentAction(store, grpc, wallet, nav, notify);
sinon.stub(payment, 'checkType');
sinon.stub(payment, 'payBitcoin');
sinon.stub(payment, 'payLightning');

storiesOf('Screens', module)
  .add('Welcome', () => <Welcome />)
  .add('Home', () => (
    <Home
      store={store}
      wallet={wallet}
      payment={payment}
      invoice={invoice}
      nav={nav}
    />
  ))
  .add('Transactions', () => <Transaction store={store} nav={nav} />)
  .add('Deposit', () => <Deposit store={store} nav={nav} />)
  .add('Payment', () => <Payment store={store} payment={payment} nav={nav} />)
  .add('Pay Lightning Confirm', () => (
    <PayLightningConfirm store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin', () => (
    <PayBitcoin store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin Confirm', () => (
    <PayBitcoinConfirm store={store} payment={payment} nav={nav} />
  ))
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
store.payment = {
  amount: '0.45678',
  address: 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K',
  fee: '0.0001',
};
store.invoice = {
  amount: '0.45678',
  note: 'For the love of bitcoin',
  encoded:
    'lnbc4567800n1pdvqx48pp5eng6uyqnkdlx93m2598ug93qtuls8gapygxznshzd56h7n5cxs0sdp9gehhygr5dpjjqmr0wejjqmmxyp3xjarrda5kucqzysmhyrleqpt3yqf5nctzsr3hvrv9vhhnawazkwyzu8t4mf85tllsyjsf8hgu5nt6dj3jaljjgmt999xnlsweqvatypzlu34nhpjlxf59qp4dn2pv',
  uri: `lightning:${this.encoded}`,
};
