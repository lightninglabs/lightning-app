import { Store } from '../../../src/store';
import SettingAction from '../../../src/action/setting';
import WalletAction from '../../../src/action/wallet';

describe('Action Setting Unit Test', () => {
  let store;
  let wallet;
  let setting;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    store = new Store();
    sandbox.stub(store, 'save');
    wallet = sinon.createStubInstance(WalletAction);
    setting = new SettingAction(store, wallet);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('setBitcoinUnit()', () => {
    it('should set a valid unit and save settings', () => {
      setting.setBitcoinUnit({ unit: 'sat' });
      expect(store.settings.unit, 'to equal', 'sat');
      expect(store.save, 'was called once');
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
    it('should set a valid fiat currency and save settings', () => {
      setting.setFiatCurrency({ fiat: 'eur' });
      expect(store.settings.fiat, 'to equal', 'eur');
      expect(wallet.getExchangeRate, 'was called once');
      expect(store.save, 'was called once');
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
