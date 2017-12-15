import store from '../store';
const { ipcRenderer } = window.require('electron');

class ActionsNav {
  constructor() {
    ipcRenderer.on('open-url', (event, arg) => {
      // TODO: Go to route
      console.log('open-url', arg);
    });
  }

  goPay() {
    store.route = 'Pay';
  }
  goRequest() {
    store.route = 'Request';
  }
  goChannels() {
    store.route = 'Channels';
  }
  goTransactions() {
    store.route = 'Transactions';
  }
  goSettings() {
    store.route = 'Settings';
  }
  goCreateChannel() {
    store.route = 'CreateChannel';
  }
  goInitializeWallet() {
    store.route = 'InitializeWallet';
  }
  goVerifyWallet() {
    store.route = 'VerifyWallet';
  }
}

export default new ActionsNav();
