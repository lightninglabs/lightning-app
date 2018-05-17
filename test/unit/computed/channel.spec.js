import { observable, useStrict } from 'mobx';
import ComputedChannel from '../../../src/computed/channel';
import { DEFAULT_UNIT, DEFAULT_FIAT } from '../../../src/config';

describe('Computed Channels Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      settings: {
        unit: DEFAULT_UNIT,
        fiat: DEFAULT_FIAT,
        displayFiat: false,
        exchangeRate: {
          usd: null,
          eur: null,
        },
      },
      channels: [
        {
          remotePubkey: 'some-pub-key',
          id: '0',
          capacity: 2005000,
          localBalance: 1990000,
          remoteBalance: 10000,
          channelPoint: 'some-channel-point',
          active: true,
          status: 'open',
        },
      ],
      pendingChannels: [
        {
          remotePubkey: 'some-pub-key',
          id: '1',
          capacity: 1005000,
          localBalance: 600000,
          remoteBalance: 400000,
          channelPoint: 'some-channel-point',
          status: 'pending-open',
        },
        {
          remotePubkey: 'some-pub-key',
          id: '2',
          capacity: 805000,
          localBalance: 500000,
          remoteBalance: 300000,
          channelPoint: 'some-channel-point',
          status: 'pending-closing',
        },
      ],
    });
  });

  describe('ComputedChannel()', () => {
    it('should work with empty store', () => {
      store.channels = null;
      store.pendingChannels = null;
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 0);
      expect(store.channelBalanceOpenLabel, 'to equal', '0');
      expect(store.channelBalancePendingLabel, 'to equal', '0');
      expect(store.channelBalanceClosingLabel, 'to equal', '0');
    });

    it('should aggregate open and pending channels', () => {
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 3);
      const ch = store.computedChannels.find(t => t.id === '0');
      expect(ch.statusLabel, 'to equal', 'Open');
      expect(ch.capacityLabel, 'to match', /0[,.]02005/);
      expect(ch.localBalanceLabel, 'to match', /0[,.]0199/);
      expect(ch.remoteBalanceLabel, 'to match', /0[,.]0001/);
      expect(store.channelBalanceOpenLabel, 'to match', /0[,.]0199/);
      expect(store.channelBalancePendingLabel, 'to match', /0[,.]006/);
      expect(store.channelBalanceClosingLabel, 'to match', /0[,.]005/);
    });

    it('should channel values in usd', () => {
      store.settings.displayFiat = true;
      store.settings.exchangeRate.usd = 0.00014503;
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 3);
      const ch = store.computedChannels.find(t => t.id === '0');
      expect(ch.capacityLabel, 'to match', /138[,.]25/);
      expect(ch.localBalanceLabel, 'to match', /137[,.]21/);
      expect(ch.remoteBalanceLabel, 'to match', /0[,.]69/);
      expect(store.channelBalanceOpenLabel, 'to match', /137[,.]21/);
      expect(store.channelBalancePendingLabel, 'to match', /41[,.]37/);
      expect(store.channelBalanceClosingLabel, 'to match', /34[,.]48/);
    });
  });
});
