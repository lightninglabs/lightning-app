import { observable, useStrict } from 'mobx';
import ComputedSetting from '../../../src/computed/setting';
import { DEFAULT_UNIT, DEFAULT_FIAT } from '../../../src/config';

describe('Computed Settings Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      notifications: [],
      settings: {
        unit: DEFAULT_UNIT,
        fiat: DEFAULT_FIAT,
        displayFiat: false,
        exchangeRate: {
          usd: null,
          eur: null,
        },
      },
    });
  });

  describe('ComputedSetting()', () => {
    it('should work with initial store', () => {
      ComputedSetting(store);
      expect(store.selectedUnitLabel, 'to equal', 'BTC');
      expect(store.selectedFiatLabel, 'to equal', 'US Dollar');
      expect(store.notificationCountLabel, 'to equal', '0');
    });

    it('should display satoshis denmoinated in BTC', () => {
      store.settings.unit = 'sat';
      ComputedSetting(store);
      expect(store.selectedUnitLabel, 'to match', /SAT \(0[,.]00000001 BTC\)/);
    });

    it('should display notification count as a string', () => {
      store.notifications.push({ type: 'error' });
      ComputedSetting(store);
      expect(store.notificationCountLabel, 'to equal', '1');
    });
  });
});
