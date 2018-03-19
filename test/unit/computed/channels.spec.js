import { observable, useStrict } from 'mobx';
import ComputedChannels from '../../../src/computed/channels';

describe('Computed Channels Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
  });

  describe('ComputedChannels()', () => {
    it('should work with empty store', () => {
      store = observable({});
      ComputedChannels(store);
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
      ComputedChannels(store);
      expect(store.computedChannels.length, 'to equal', 3);
    });
  });
});
