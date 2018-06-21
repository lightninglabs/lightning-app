import SettingAction from '../../../src/action/setting';
import { observable } from 'mobx';

describe('Action Setting Unit Test', () => {
  let store;
  let setting;

  beforeEach(() => {
    store = observable({
      settings: {
        unit: 'btc',
        fiat: 'usd',
        displayFiat: false,
        exchangeRate: {
          usd: null,
        },
      },
    });
    setting = new SettingAction(store);
  });

  describe('setBitcoinUnit()', () => {
    it('should set a valid unit', () => {
      setting.setBitcoinUnit('sat');
      expect(store.settings.unit, 'to equal', 'sat');
      setting.setBitcoinUnit('bit');
      expect(store.settings.unit, 'to equal', 'bit');
      setting.setBitcoinUnit('btc');
      expect(store.settings.unit, 'to equal', 'btc');
    });
    it('should reject invalid unit types', () => {
      setting.setBitcoinUnit('invalid');
      expect(store.settings.unit, 'to equal', 'btc');
      setting.setBitcoinUnit(null);
      expect(store.settings.unit, 'to equal', 'btc');
    });
  });
});
