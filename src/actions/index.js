import { observe } from 'mobx';
import { AsyncStorage } from 'react-native';
import store from '../store';
import ActionsGrpc from './grpc';
import ActionsNav from './nav';
import ActionsWallet from './wallet';
import ActionsLogs from './logs';
import ActionsInfo from './info';
import ActionsNotification from './notification';
import ActionsChannels from './channels';
import ActionsTransactions from './transactions';
import ActionsPayments from './payments';

const { remote, ipcRenderer } = window.require('electron');

//
// Inject dependencies
//

store.init(AsyncStorage);

export const actionsLogs = new ActionsLogs(store, ipcRenderer);
export const actionsNotification = new ActionsNotification(store);
export const actionsGrpc = new ActionsGrpc(store, remote);
export const actionsNav = new ActionsNav(store, ipcRenderer);
export const actionsWallet = new ActionsWallet(store, actionsGrpc, actionsNav);
export const actionsInfo = new ActionsInfo(store, actionsGrpc);
export const actionsChannels = new ActionsChannels(store, actionsGrpc);
export const actionsTransactions = new ActionsTransactions(store, actionsGrpc);
export const actionsPayments = new ActionsPayments(
  store,
  actionsGrpc,
  actionsWallet,
  actionsNotification
);

//
// Init actions
//

observe(store, 'loaded', () => {
  actionsWallet.initializeWallet();
});

observe(store, 'lndReady', () => {
  // init wallet
  actionsWallet.getBalance();
  actionsWallet.getChannelBalance();
  actionsWallet.getNewAddress();
  // init info
  actionsInfo.getInfo();
  // init channels
  actionsChannels.pollChannels();
  actionsChannels.pollPendingChannels();
  actionsChannels.pollPeers();
  // init transactions
  actionsTransactions.getTransactions();
  actionsTransactions.getInvoices();
  actionsTransactions.getPayments();
});
