import { observable, useStrict } from 'mobx';
import ComputedSeed from '../../../src/computed/seed';

describe('Computed Seed Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({ seedMnemonic: [] });
  });

  describe('ComputedSeed()', () => {
    it('should work with initial store', () => {
      ComputedSeed(store);
      expect(store.seedCheck, 'to equal', []);
    });

    it('should set seed check attributes', () => {
      store.seedMnemonic = [
        'empower',
        'neglect',
        'experience',
        'elevator',
        'entropy',
        'future',
        'trust',
        'swift',
        'pluck',
        'easy',
        'kite',
        'measure',
        'engage',
        'settle',
        'dog',
        'manager',
        'tool',
        'fan',
        'neglect',
        'conduct',
        'blouse',
        'stone',
        'quit',
        'cashew',
      ];
      ComputedSeed(store);
      expect(store.seedCheck.length, 'to equal', 3);
      for (let i = 0; i < 3; i++) {
        expect(store.seedCheck[i], 'to be greater than', 0);
        expect(store.seedCheck[i], 'to be less than', 25);
      }
    });
  });
});
