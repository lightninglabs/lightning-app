import store from '../store';
import ActionsGrpc from './grpc';
import ActionsNav from './nav';
import ActionsWallet from './wallet';
import ActionsLogs from './logs';
import ActionsInfo from './info';
import ActionsChannels from './channels';
import ActionsTransactions from './transactions';
import ActionsPayments from './payments';

const { remote, ipcRenderer } = window.require('electron');

export const actionsLogs = new ActionsLogs(store, ipcRenderer);
export const actionsGrpc = new ActionsGrpc(store, remote);
export const actionsNav = new ActionsNav(store, ipcRenderer);
export const actionsWallet = new ActionsWallet(store, actionsGrpc, actionsNav);
export const actionsInfo = new ActionsInfo(store, actionsGrpc);
export const actionsChannels = new ActionsChannels(store, actionsGrpc);
export const actionsTransactions = new ActionsTransactions(store, actionsGrpc);
export const actionsPayments = new ActionsPayments(
  store,
  actionsGrpc,
  actionsWallet
);
