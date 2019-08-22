import { Store } from '../../src/store';

describe('Store Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('init()', () => {
    it('should set computed vales', () => {
      expect(store.unitFiatLabel, 'to be', undefined);
      store.init();
      expect(store.unitFiatLabel, 'to equal', 'sats');
    });
  });
});
