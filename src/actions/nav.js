import store from '../store';

class ActionsNav {
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
}

export default new ActionsNav();
