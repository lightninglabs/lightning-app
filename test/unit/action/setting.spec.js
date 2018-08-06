import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import SettingAction from '../../../src/action/setting';
import WalletAction from '../../../src/action/wallet';
import AppStorage from '../../../src/action/app-storage';
import { DEFAULT_FIAT } from '../../../src/config';

describe('Action Setting Unit Test', () => {
  let grpc;
  let store;
  let wallet;
  let db;
  let setting;

  beforeEach(() => {
    grpc = sinon.createStubInstance(GrpcAction);
    store = new Store();
    wallet = sinon.createStubInstance(WalletAction);
    db = sinon.createStubInstance(AppStorage);
    setting = new SettingAction(store, grpc, wallet, db);
  });

  describe('setBitcoinUnit()', () => {
    it('should set a valid unit and save settings', () => {
      setting.setBitcoinUnit({ unit: 'sat' });
      expect(store.settings.unit, 'to equal', 'sat');
      expect(db.save, 'was called once');
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
      expect(db.save, 'was called once');
    });

    it('should use default fiat type when locale is unsupported', () => {
      setting.setFiatCurrency({ fiat: 'sn-ZW' });
      expect(store.settings.fiat, 'to equal', DEFAULT_FIAT);
    });
  });
});
