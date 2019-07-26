import React from 'react';
import { Clipboard } from 'react-native';
import { storiesOf } from './storybook-react';
import { action } from '@storybook/addon-actions';
import sinon from 'sinon';
import { Store } from '../src/store';
import NavAction from '../src/action/nav';
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
import AuthAction from '../src/action/auth-mobile';
import FileAction from '../src/action/file-mobile';
import AtplAction from '../src/action/autopilot';
import Welcome from '../src/view/welcome';
import Transaction from '../src/view/transaction';
import TransactionMobile from '../src/view/transaction-mobile';
import Setting from '../src/view/setting';
import SettingUnit from '../src/view/setting-unit';
import SettingFiat from '../src/view/setting-fiat';
import CLI from '../src/view/cli';
import Notification from '../src/view/notification';
import NotificationMobile from '../src/view/notification-mobile';
import TransactionDetail from '../src/view/transaction-detail';
import TransactionDetailMobile from '../src/view/transaction-detail-mobile';
import Channel from '../src/view/channel';
import ChannelMobile from '../src/view/channel-mobile';
import ChannelDetail from '../src/view/channel-detail';
import ChannelDetailMobile from '../src/view/channel-detail-mobile';
import ChannelDelete from '../src/view/channel-delete';
import ChannelCreate from '../src/view/channel-create';
import ChannelCreateMobile from '../src/view/channel-create-mobile';
import Home from '../src/view/home';
import Deposit from '../src/view/deposit';
import DepositMobile from '../src/view/deposit-mobile';
import Invoice from '../src/view/invoice';
import InvoiceMobile from '../src/view/invoice-mobile';
import InvoiceQR from '../src/view/invoice-qr';
import InvoiceQRMobile from '../src/view/invoice-qr-mobile';
import Payment from '../src/view/payment';
import PayLightningConfirm from '../src/view/pay-lightning-confirm';
import PayLightningConfirmMobile from '../src/view/pay-lightning-confirm-mobile';
import PayLightningDone from '../src/view/pay-lightning-done';
import PayLightningDoneMobile from '../src/view/pay-lightning-done-mobile';
import PayBitcoin from '../src/view/pay-bitcoin';
import PayBitcoinMobile from '../src/view/pay-bitcoin-mobile';
import PayBitcoinConfirm from '../src/view/pay-bitcoin-confirm';
import PayBitcoinConfirmMobile from '../src/view/pay-bitcoin-confirm-mobile';
import PayBitcoinDone from '../src/view/pay-bitcoin-done';
import PayBitcoinDoneMobile from '../src/view/pay-bitcoin-done-mobile';
import PaymentFailed from '../src/view/payment-failed';
import PaymentFailedMobile from '../src/view/payment-failed-mobile';
import Loader from '../src/view/loader';
import LoaderSyncing from '../src/view/loader-syncing';
import LoaderSyncingMobile from '../src/view/loader-syncing-mobile';
import SelectSeed from '../src/view/select-seed';
import SeedIntro from '../src/view/seed-intro-mobile';
import SeedSuccess from '../src/view/seed-success';
import SeedSuccessMobile from '../src/view/seed-success-mobile';
import Seed from '../src/view/seed';
import SeedMobile from '../src/view/seed-mobile';
import SeedVerify from '../src/view/seed-verify';
import SeedVerifyMobile from '../src/view/seed-verify-mobile';
import SetPassword from '../src/view/set-password';
import SetPinMobile from '../src/view/set-pin-mobile';
import SetPasswordConfirm from '../src/view/set-password-confirm';
import SetPinConfirmMobile from '../src/view/set-pin-confirm-mobile';
import Password from '../src/view/password';
import PinMobile from '../src/view/pin-mobile';
import ResetPasswordCurrent from '../src/view/reset-password-current';
import ResetPasswordNew from '../src/view/reset-password-new';
import ResetPasswordConfirm from '../src/view/reset-password-confirm';
import ResetPasswordSaved from '../src/view/reset-password-saved';
import ResetPinCurrent from '../src/view/reset-pin-current-mobile';
import ResetPinNew from '../src/view/reset-pin-new-mobile';
import ResetPinConfirm from '../src/view/reset-pin-confirm-mobile';
import ResetPinSaved from '../src/view/reset-pin-saved-mobile';
import NewAddress from '../src/view/new-address';
import NewAddressMobile from '../src/view/new-address-mobile';
import Wait from '../src/view/wait';
import WaitMobile from '../src/view/wait-mobile';
import RestoreSeed from '../src/view/restore-seed';
import RestoreSeedMobile from '../src/view/restore-seed-mobile';

const store = new Store();
store.init();
const file = sinon.createStubInstance(FileAction);
const nav = sinon.createStubInstance(NavAction);
const db = sinon.createStubInstance(AppStorage);
const ipc = sinon.createStubInstance(IpcAction);
const grpc = sinon.createStubInstance(GrpcAction);
const info = sinon.createStubInstance(InfoAction);
const notify = sinon.createStubInstance(NotificationAction);
const wallet = new WalletAction(store, grpc, db, nav, notify);
const setting = new SettingAction(store, wallet, db, ipc);
const autopilot = sinon.createStubInstance(AtplAction);
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
sinon.stub(payment, 'toggleMax');
sinon.stub(payment, 'payLightning');
sinon.stub(payment, 'initPayBitcoinConfirm');
const channel = new ChannelAction(store, grpc, nav, notify);
sinon.stub(channel, 'update');
sinon.stub(channel, 'connectAndOpen');
sinon.stub(channel, 'closeSelectedChannel');
const auth = new AuthAction(store, wallet, nav);
sinon.stub(auth, 'checkNewPin');
sinon.stub(auth, 'checkPin');
sinon.stub(auth, 'tryFingerprint');
sinon.stub(auth, '_unlockWallet');
sinon.stub(auth, '_generateWalletPassword');

storiesOf('Screens', module)
  .add('Welcome', () => <Welcome />)
  .add('Loader - First Time', () => <Loader />)
  .add('Select Seed', () => (
    <SelectSeed store={store} wallet={wallet} setting={setting} />
  ))
  .add('Seed Intro (Mobile)', () => <SeedIntro nav={nav} />)
  .add('Seed', () => <Seed store={store} wallet={wallet} />)
  .add('Seed (Mobile)', () => <SeedMobile store={store} wallet={wallet} />)
  .add('Seed Verify', () => (
    <SeedVerify store={store} nav={nav} wallet={wallet} />
  ))
  .add('Seed Verify (Mobile)', () => (
    <SeedVerifyMobile store={store} nav={nav} wallet={wallet} />
  ))
  .add('Restore Wallet: Seed', () => (
    <RestoreSeed store={store} wallet={wallet} />
  ))
  .add('Restore Wallet: Seed (Mobile)', () => (
    <RestoreSeedMobile store={store} wallet={wallet} />
  ))
  .add('Seed Success', () => <SeedSuccess wallet={wallet} />)
  .add('Seed Success (Mobile)', () => <SeedSuccessMobile wallet={wallet} />)
  .add('Set Password', () => (
    <SetPassword store={store} wallet={wallet} nav={nav} />
  ))
  .add('Set Password Confirm', () => (
    <SetPasswordConfirm store={store} wallet={wallet} />
  ))
  .add('Set PIN (Mobile)', () => (
    <SetPinMobile store={store} auth={auth} nav={nav} />
  ))
  .add('Set PIN Confirm (Mobile)', () => (
    <SetPinConfirmMobile store={store} auth={auth} />
  ))
  .add('Password', () => <Password store={store} wallet={wallet} />)
  .add('PIN (Mobile)', () => <PinMobile store={store} auth={auth} />)
  .add('Reset Password - Current', () => (
    <ResetPasswordCurrent store={store} wallet={wallet} nav={nav} />
  ))
  .add('Reset Password - New', () => (
    <ResetPasswordNew store={store} wallet={wallet} nav={nav} />
  ))
  .add('Reset Password - Confirm New', () => (
    <ResetPasswordConfirm store={store} wallet={wallet} nav={nav} />
  ))
  .add('Reset Password - Saved', () => <ResetPasswordSaved nav={nav} />)
  .add('Reset PIN - Current (Mobile)', () => (
    <ResetPinCurrent store={store} auth={auth} nav={nav} />
  ))
  .add('Reset PIN - New (Mobile)', () => (
    <ResetPinNew store={store} auth={auth} />
  ))
  .add('Reset PIN - Confirm New (Mobile)', () => (
    <ResetPinConfirm store={store} auth={auth} />
  ))
  .add('Reset PIN - Saved (Mobile)', () => <ResetPinSaved nav={nav} />)
  .add('New Address', () => (
    <NewAddress store={store} invoice={invoice} info={info} />
  ))
  .add('New Address (Mobile)', () => (
    <NewAddressMobile store={store} invoice={invoice} info={info} />
  ))
  .add('Loader - Syncing Chain', () => <LoaderSyncing store={store} />)
  .add('Loader - Syncing Chain (Mobile)', () => (
    <LoaderSyncingMobile store={store} />
  ))
  .add('Wait', () => <Wait />)
  .add('Wait (Mobile)', () => <WaitMobile />)
  .add('Home', () => (
    <Home
      store={store}
      wallet={wallet}
      channel={channel}
      payment={payment}
      invoice={invoice}
      transaction={transaction}
      nav={nav}
    />
  ))
  .add('Settings', () => (
    <Setting store={store} nav={nav} wallet={wallet} autopilot={autopilot} />
  ))
  .add('Settings Units', () => (
    <SettingUnit store={store} nav={nav} setting={setting} />
  ))
  .add('Settings Fiat', () => (
    <SettingFiat store={store} nav={nav} setting={setting} />
  ))
  .add('Notifications', () => <Notification store={store} nav={nav} />)
  .add('Notifications (Mobile)', () => (
    <NotificationMobile store={store} nav={nav} />
  ))
  .add('CLI', () => <CLI store={store} nav={nav} file={file} />)
  .add('Transactions', () => (
    <Transaction store={store} transaction={transaction} nav={nav} />
  ))
  .add('Transactions (Mobile)', () => (
    <TransactionMobile store={store} transaction={transaction} nav={nav} />
  ))
  .add('Transaction Details', () => (
    <TransactionDetail store={store} nav={nav} />
  ))
  .add('Transaction Details (Mobile)', () => (
    <TransactionDetailMobile store={store} nav={nav} />
  ))
  .add('Channels', () => <Channel store={store} channel={channel} nav={nav} />)
  .add('Channels (Mobile)', () => (
    <ChannelMobile store={store} channel={channel} nav={nav} />
  ))
  .add('Channels (Opening)', () => (
    <Channel store={{ computedChannels: [] }} channel={channel} nav={nav} />
  ))
  .add('Channels (Opening) (Mobile)', () => (
    <ChannelMobile
      store={{ computedChannels: [] }}
      channel={channel}
      nav={nav}
    />
  ))
  .add('Channel Details', () => <ChannelDetail store={store} nav={nav} />)
  .add('Channel Details (Mobile)', () => (
    <ChannelDetailMobile store={store} nav={nav} />
  ))
  .add('Channel Delete', () => (
    <ChannelDelete store={store} channel={channel} nav={nav} />
  ))
  .add('Channel Create', () => (
    <ChannelCreate store={store} channel={channel} nav={nav} />
  ))
  .add('Channel Create (Mobile)', () => (
    <ChannelCreateMobile store={store} channel={channel} nav={nav} />
  ))
  .add('Deposit', () => <Deposit store={store} invoice={invoice} nav={nav} />)
  .add('Deposit (Mobile)', () => (
    <DepositMobile store={store} invoice={invoice} nav={nav} />
  ))
  .add('Payment', () => <Payment store={store} payment={payment} nav={nav} />)
  .add('Pay Lightning Confirm', () => (
    <PayLightningConfirm store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Lightning Confirm (Mobile)', () => (
    <PayLightningConfirmMobile store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Lightning Done', () => (
    <PayLightningDone store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Lightning Done (Mobile)', () => (
    <PayLightningDoneMobile store={store} payment={payment} nav={nav} />
  ))
  .add('Payment Failed', () => <PaymentFailed channel={channel} nav={nav} />)
  .add('Payment Failed (Mobile)', () => (
    <PaymentFailedMobile channel={channel} nav={nav} />
  ))
  .add('Pay Bitcoin', () => (
    <PayBitcoin store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin (Mobile)', () => (
    <PayBitcoinMobile store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin Confirm', () => (
    <PayBitcoinConfirm store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin Confirm (Mobile)', () => (
    <PayBitcoinConfirmMobile store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin Done', () => <PayBitcoinDone payment={payment} nav={nav} />)
  .add('Pay Bitcoin Done (Mobile)', () => (
    <PayBitcoinDoneMobile payment={payment} nav={nav} />
  ))
  .add('Invoice', () => <Invoice store={store} invoice={invoice} nav={nav} />)
  .add('Invoice (Mobile)', () => (
    <InvoiceMobile store={store} invoice={invoice} nav={nav} />
  ))
  .add('Invoice QR', () => (
    <InvoiceQR store={store} invoice={invoice} nav={nav} />
  ))
  .add('Invoice QR (Mobile)', () => (
    <InvoiceQRMobile store={store} invoice={invoice} nav={nav} />
  ));

// set some dummy data
store.walletAddress = 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K';
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
store.notifications = [...Array(5)].map((x, i) => ({
  type: i % 2 === 0 ? 'error' : 'success',
  message:
    i % 2 === 0 ? 'Oops. Something went wrong.' : 'Something good happened.',
  date: new Date(),
  handler: i % 2 === 0 ? action('handle_error') : null,
  handlerLbl: i % 2 === 0 ? 'Show error logs' : null,
  display: true,
}));
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
store.payments = [...Array(10)].map(() => ({
  id: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  type: 'lightning',
  amount: 92345,
  fee: 1,
  status: 'complete',
  date: new Date(),
}));
store.payment.note = '#craefulgang';
store.selectedTransaction = (store.computedTransactions || []).find(
  tx => tx.type === 'bitcoin'
);
store.channels = [...Array(4)].map((x, i) => ({
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
  active: i % 2 === 0 ? true : false,
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
store.selectedChannel = store.computedChannels && store.computedChannels[0];
store.percentSynced = 0.3;
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
