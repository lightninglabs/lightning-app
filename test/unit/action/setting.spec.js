import { Store } from '../../../src/store';
import IpcAction from '../../../src/action/ipc';
import SettingAction from '../../../src/action/setting';
import WalletAction from '../../../src/action/wallet';
import AppStorage from '../../../src/action/app-storage';
import * as logger from '../../../src/action/log';

describe('Action Setting Unit Test', () => {
  let store;
  let wallet;
  let db;
  let ipc;
  let setting;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    wallet = sinon.createStubInstance(WalletAction);
    db = sinon.createStubInstance(AppStorage);
    ipc = sinon.createStubInstance(IpcAction);
    setting = new SettingAction(store, wallet, db, ipc);
  });

  afterEach(() => {
    sandbox.restore();
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
    it('should set a valid fiat currency and save settings', async () => {
      await setting.setFiatCurrency({ fiat: 'eur' });
      expect(store.settings.fiat, 'to equal', 'eur');
      expect(wallet.getExchangeRate, 'was called once');
      expect(db.save, 'was called once');
    });

    it('should throw error on invalid fiat type', async () => {
      await expect(
        setting.setFiatCurrency({ fiat: 'invalid' }),
        'to be rejected with error satisfying',
        /Invalid/
      );
    });
  });

  describe('detectLocalCurrency()', () => {
    it('should detect Euro for Germany and save settings', async () => {
      ipc.send.resolves('de');
      await setting.detectLocalCurrency();
      expect(store.settings.fiat, 'to equal', 'eur');
      expect(wallet.getExchangeRate, 'was called once');
      expect(db.save, 'was called once');
    });

    it('should log error', async () => {
      ipc.send.rejects(new Error('Boom!'));
      await setting.detectLocalCurrency();
      expect(logger.error, 'was called with', /Detecting/, /Boom/);
    });

    it('should fall back to USD for unsupported fiat', async () => {
      ipc.send.resolves('jp');
      await setting.detectLocalCurrency();
      expect(store.settings.fiat, 'to equal', 'usd');
      expect(logger.error, 'was called with', /Detecting/, /Invalid fiat/);
      expect(db.save, 'was not called');
    });
  });

  describe('setRestoringWallet()', () => {
    it('should clear attributes', () => {
      setting.setRestoringWallet({ restoring: true });
      expect(store.settings.restoring, 'to equal', true);
    });
  });
});
