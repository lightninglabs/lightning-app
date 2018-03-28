import * as log from './logs';

class NavAction {
  constructor(store, ipcRenderer) {
    this._store = store;
    ipcRenderer.on('open-url', (event, arg) => {
      // TODO: Go to route
      log.info('open-url', arg);
    });
  }

  goPay() {
    this._store.route = 'Pay';
  }

  goRequest() {
    this._store.route = 'Request';
  }

  goChannels() {
    this._store.route = 'Channels';
  }

  goTransactions() {
    this._store.route = 'Transactions';
  }

  goSettings() {
    this._store.route = 'Settings';
  }

  goCreateChannel() {
    this._store.route = 'CreateChannel';
  }

  goInitializeWallet() {
    this._store.route = 'InitializeWallet';
  }

  goVerifyWallet() {
    this._store.route = 'VerifyWallet';
  }
}

export default NavAction;
