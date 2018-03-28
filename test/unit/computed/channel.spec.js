import { observable, useStrict } from 'mobx';
import ComputedChannel from '../../../src/computed/channel';

describe('Computed Channels Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
  });

  describe('ComputedChannel()', () => {
    it('should work with empty store', () => {
      store = observable({});
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 0);
    });

    it('should aggregate open and pending channels', () => {
      store = observable({
        channels: [
          {
            active: true,
            status: 'open',
          },
        ],
        pendingChannels: [
          {
            status: 'pending-open',
          },
          {
            status: 'pending-closing',
          },
        ],
      });
      ComputedChannel(store);
      expect(store.computedChannels.length, 'to equal', 3);
    });
  });
});
