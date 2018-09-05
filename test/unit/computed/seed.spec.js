import { Store } from '../../../src/store';
import ComputedSeed, { formatOrdinal } from '../../../src/computed/seed';

describe('Computed Seed Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('ComputedSeed()', () => {
    it('should work with initial store', () => {
      ComputedSeed(store);
      expect(store.seedVerifyIndexes, 'to equal', []);
      expect(
        store.seedVerifyCopy,
        'to equal',
        'Type the 0th, 0th, and 0th words of your recovery phrase.'
      );
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
      expect(store.seedVerifyIndexes.length, 'to equal', 3);
      for (let i = 0; i < 3; i++) {
        expect(store.seedVerifyIndexes[i], 'to be greater than', 0);
        expect(store.seedVerifyIndexes[i], 'to be less than', 25);
      }
      expect(store.seedVerifyCopy, 'to match', /^Type /);
    });

    it('should set restore seed check attributes', () => {
      store.wallet.restoreIndex = 3;
      ComputedSeed(store);
      expect(store.restoreIndexes.length, 'to equal', 24);
      for (let i = 0; i < 24; i++) {
        expect(store.restoreIndexes[i], 'to be greater than', 0);
        expect(store.restoreIndexes[i], 'to be less than', 25);
        if (i > 0) {
          expect(
            store.restoreIndexes[i],
            'to equal',
            store.restoreIndexes[i - 1] + 1
          );
        }
      }
      expect(store.restoreVerifyIndexes, 'to equal', [4, 5, 6]);
      expect(store.restoreVerifyCopy, 'to match', /^Type /);
    });
  });

  describe('formatOrdinal()', () => {
    it('should work for undefined', () => {
      const ordinal = formatOrdinal(undefined);
      expect(ordinal, 'to equal', '0th');
    });
    it('should work for NaN', () => {
      const ordinal = formatOrdinal(NaN);
      expect(ordinal, 'to equal', '0th');
    });
    it('should work for null', () => {
      const ordinal = formatOrdinal(null);
      expect(ordinal, 'to equal', '0th');
    });
    it('should work for string input', () => {
      const ordinal = formatOrdinal('3');
      expect(ordinal, 'to equal', '3rd');
    });
    it('should work for numbers ending in 1', () => {
      const first = formatOrdinal(1);
      const eleventh = formatOrdinal(11);
      const twentyfirst = formatOrdinal(21);
      expect(first, 'to equal', '1st');
      expect(eleventh, 'to equal', '11th');
      expect(twentyfirst, 'to equal', '21st');
    });
    it('should work for numbers ending in 2', () => {
      const second = formatOrdinal(2);
      const twelfth = formatOrdinal(12);
      const twentysecond = formatOrdinal(22);
      expect(second, 'to equal', '2nd');
      expect(twelfth, 'to equal', '12th');
      expect(twentysecond, 'to equal', '22nd');
    });
    it('should work for numbers ending in 3', () => {
      const third = formatOrdinal(3);
      const thirteenth = formatOrdinal(13);
      const twentythird = formatOrdinal(23);
      expect(third, 'to equal', '3rd');
      expect(thirteenth, 'to equal', '13th');
      expect(twentythird, 'to equal', '23rd');
    });
  });
});
