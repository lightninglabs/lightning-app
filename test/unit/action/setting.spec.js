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
});
