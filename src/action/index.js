import { observe } from 'mobx';
import { AsyncStorage, Clipboard } from 'react-native';
import store from '../store';
import GrpcAction from './grpc';
import NavAction from './nav';
import WalletAction from './wallet';
import LogAction from './log';
import InfoAction from './info';
import NotificationAction from './notification';
import ChannelAction from './channel';
import TransactionAction from './transaction';
import PaymentAction from './payment';
import InvoiceAction from './invoice';

const ipcRenderer = window.ipcRenderer; // exposed to sandbox via preload.js

//
// Inject dependencies
//

store.init(AsyncStorage);

export const log = new LogAction(store, ipcRenderer);
export const nav = new NavAction(store, ipcRenderer);
export const grpc = new GrpcAction(store, ipcRenderer);
export const notify = new NotificationAction(store);
export const wallet = new WalletAction(store, grpc, notify);
export const info = new InfoAction(store, grpc);
export const channel = new ChannelAction(store, grpc, notify);
export const transaction = new TransactionAction(store, grpc);
export const payment = new PaymentAction(store, grpc, wallet, nav, notify);
export const invoice = new InvoiceAction(store, grpc, nav, notify, Clipboard);

//
// Init actions
//

observe(store, 'loaded', async () => {
  await grpc.initUnlocker();
});

observe(store, 'unlockerReady', async () => {
  // TODO: wire up to UI
  const seedPassphrase = 'hodlgang';
  const walletPassword = 'bitconeeeeeect';
  try {
    await wallet.generateSeed({ seedPassphrase });
    await wallet.initWallet({
      walletPassword,
      seedPassphrase,
      seedMnemonic: store.seedMnemonic.toJSON(),
    });
  } catch (err) {
    await wallet.unlockWallet({ walletPassword });
  }
});

observe(store, 'walletUnlocked', async () => {
  await grpc.closeUnlocker();
  await grpc.initLnd();
});

observe(store, 'lndReady', () => {
  // init wallet
  wallet.getBalance();
  wallet.getChannelBalance();
  wallet.getNewAddress();
  wallet.getExchangeRate();
  // init info
  info.getInfo();
  // init channels
  channel.pollChannels();
  channel.pollPendingChannels();
  channel.pollPeers();
  // init transactions
  transaction.getTransactions();
  transaction.subscribeTransactions();
  transaction.getInvoices();
  transaction.subscribeInvoices();
  transaction.getPayments();
});
