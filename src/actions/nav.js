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
  goSettings() {
    store.route = 'Settings';
  }
}

export default new ActionsNav();
