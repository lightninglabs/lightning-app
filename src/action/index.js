import { observe } from 'mobx';
import { AsyncStorage } from 'react-native';
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

const ipcRenderer = window.ipcRenderer; // exposed to sandbox via preload.js

//
// Inject dependencies
//

store.init(AsyncStorage);

export const log = new LogAction(store, ipcRenderer);
export const notification = new NotificationAction(store);
export const grpc = new GrpcAction(store, ipcRenderer);
export const nav = new NavAction(store, ipcRenderer);
export const wallet = new WalletAction(store, grpc, nav, notification);
export const info = new InfoAction(store, grpc);
export const channel = new ChannelAction(store, grpc, notification);
export const transaction = new TransactionAction(store, grpc);
export const payment = new PaymentAction(store, grpc, wallet, notification);

//
// Init actions
//

observe(store, 'loaded', () => {
  // TODO: init wallet unlocker instead of lnd
  grpc.initLnd();
  // grpc.initUnlocker();
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
      seedMnemonic: store.seedMnemonic,
    });
  } catch (err) {
    await wallet.unlockWallet({ walletPassword });
  }
});

observe(store, 'walletUnlocked', () => {
  grpc.initLnd();
});

observe(store, 'lndReady', () => {
  // init wallet
  wallet.getBalance();
  wallet.getChannelBalance();
  wallet.getNewAddress();
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
