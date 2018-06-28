import { Store } from '../../../src/store';
import ComputedSetting from '../../../src/computed/setting';

describe('Computed Settings Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('ComputedSetting()', () => {
    it('should work with initial store', () => {
      ComputedSetting(store);
      expect(store.selectedUnitLabel, 'to equal', 'Bitcoin');
      expect(store.selectedFiatLabel, 'to equal', 'US Dollar');
      expect(store.notificationCountLabel, 'to equal', '0');
      expect(store.satUnitLabel, 'to be ok');
      expect(store.bitUnitLabel, 'to be ok');
      expect(store.btcUnitLabel, 'to be ok');
      expect(store.usdFiatLabel, 'to be ok');
      expect(store.eurFiatLabel, 'to be ok');
      expect(store.gbpFiatLabel, 'to be ok');
    });

    it('should display satoshis denominated in BTC', () => {
      store.settings.unit = 'sat';
      ComputedSetting(store);
      expect(
        store.selectedUnitLabel,
        'to match',
        /Satoshi {3}\(0[,.]00000001 BTC\)/
      );
    });

    it('should display notification count as a string', () => {
      store.notifications.push({ type: 'error' });
      ComputedSetting(store);
      expect(store.notificationCountLabel, 'to equal', '1');
    });
  });
});
