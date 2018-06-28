import { Store } from '../../../src/store';
import SettingAction from '../../../src/action/setting';

describe('Action Setting Unit Test', () => {
  let store;
  let setting;

  beforeEach(() => {
    store = new Store();
    setting = new SettingAction(store);
  });

  describe('setBitcoinUnit()', () => {
    it('should set a valid unit', () => {
      setting.setBitcoinUnit({ unit: 'sat' });
      expect(store.settings.unit, 'to equal', 'sat');
    });

    it('should throw error on invalid unit type', () => {
      expect(
        setting.setBitcoinUnit.bind(null, { unit: 'invalid' }),
        'to throw',
        /Invalid/
      );
    });
  });

  describe('setFiatCurrency()', () => {
    it('should set a valid fiat currency', () => {
      setting.setFiatCurrency({ fiat: 'eur' });
      expect(store.settings.fiat, 'to equal', 'eur');
    });

    it('should throw error on invalid fiat type', () => {
      expect(
        setting.setFiatCurrency.bind(null, { fiat: 'invalid' }),
        'to throw',
        /Invalid/
      );
    });
  });
});
