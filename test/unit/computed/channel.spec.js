import { Store } from '../../../src/store';
import ComputedChannel from '../../../src/computed/channel';

describe('Computed Channels Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
    store.settings.displayFiat = false;
    store.channels.push({
      remotePubkey: 'some-pub-key',
      id: '0',
      capacity: 2005000,
      localBalance: 1990000,
      remoteBalance: 10000,
      channelPoint: 'some-channel-point',
      active: true,
      status: 'open',
    });
    store.channels.push({
      remotePubkey: 'some-pub-key',
      id: '1',
      capacity: 2005000,
      localBalance: 1990000,
      remoteBalance: 10000,
      channelPoint: 'some-channel-point',
      active: false,
      status: 'open',
    });
    store.pendingChannels.push({
      remotePubkey: 'some-pub-key',
      id: '2',
      capacity: 1005000,
      localBalance: 600000,
      remoteBalance: 400000,
      channelPoint: 'some-channel-point',
      status: 'pending-open',
    });
    store.pendingChannels.push({
      remotePubkey: 'some-pub-key',
      id: '3',
      capacity: 805000,
      localBalance: 500000,
      remoteBalance: 300000,
      channelPoint: 'some-channel-point',
      status: 'pending-closing',
    });
  });

  describe('ComputedChannel()', () => {
    it('should work with empty store', () => {
      store.channels = null;
      store.pendingChannels = null;
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 0);
      expect(store.channelBalanceOpenLabel, 'to equal', '0');
      expect(store.channelBalanceInactiveLabel, 'to equal', '0');
      expect(store.channelBalancePendingLabel, 'to equal', '0');
      expect(store.channelBalanceClosingLabel, 'to equal', '0');
      expect(store.showChannelAlert, 'to equal', true);
      expect(store.channelStatus, 'to equal', 'error');
    });

    it('should aggregate open and pending channels', () => {
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 4);

      const ch = store.computedChannels.find(t => t.id === '0');
      expect(ch.statusLabel, 'to equal', 'Open');
      expect(ch.statusType, 'to equal', 'success');
      expect(ch.capacityLabel, 'to match', /0[,.]02005/);
      expect(ch.localBalanceLabel, 'to match', /0[,.]0199/);
      expect(ch.remoteBalanceLabel, 'to match', /0[,.]0001/);

      const inactiveCh = store.computedChannels.find(t => t.id === '1');
      expect(inactiveCh.statusLabel, 'to equal', 'Inactive');
      expect(inactiveCh.statusType, 'to equal', 'inactive');

      const pendingOpenCh = store.computedChannels.find(t => t.id === '2');
      expect(pendingOpenCh.statusLabel, 'to equal', 'Pending Open');
      expect(pendingOpenCh.statusType, 'to equal', 'info');

      const pendingCloseCh = store.computedChannels.find(t => t.id === '3');
      expect(pendingCloseCh.statusLabel, 'to equal', 'Pending Closing');
      expect(pendingCloseCh.statusType, 'to equal', 'error');

      expect(store.channelBalanceOpenLabel, 'to match', /0[,.]0199/);
      expect(store.channelBalanceInactiveLabel, 'to match', /0[,.]0199/);
      expect(store.channelBalancePendingLabel, 'to match', /0[,.]006/);
      expect(store.channelBalanceClosingLabel, 'to match', /0[,.]005/);
      expect(store.showChannelAlert, 'to equal', false);
      expect(store.channelStatus, 'to equal', 'success');
    });

    it('should channel values in usd', () => {
      store.settings.displayFiat = true;
      store.settings.exchangeRate.usd = 0.00014503;
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 4);
      const ch = store.computedChannels.find(t => t.id === '0');
      expect(ch.capacityLabel, 'to match', /138[,.]25/);
      expect(ch.localBalanceLabel, 'to match', /137[,.]21/);
      expect(ch.remoteBalanceLabel, 'to match', /0[,.]69/);
      expect(store.channelBalanceOpenLabel, 'to match', /137[,.]21/);
      expect(store.channelBalanceInactiveLabel, 'to match', /137[,.]21/);
      expect(store.channelBalancePendingLabel, 'to match', /41[,.]37/);
      expect(store.channelBalanceClosingLabel, 'to match', /34[,.]48/);
    });

    it('should display pending status', () => {
      store.channels = null;
      ComputedChannel(store);
      expect(store.channelStatus, 'to equal', 'info');
    });

    it('should display inactive status', () => {
      store.channels[0].active = false;
      ComputedChannel(store);
      expect(store.channelStatus, 'to equal', 'inactive');
    });
  });
});
