import { Store } from '../../../src/store';
import AppStorage from '../../../src/action/app-storage';
import * as logger from '../../../src/action/log';

describe('Action App Storage Unit Tests', () => {
  let sandbox;
  let store;
  let AsyncStorageStub;
  let db;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    AsyncStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      clear: sinon.stub(),
    };
    db = new AppStorage(store, AsyncStorageStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('restore()', () => {
    it('should use default if nothing is saved yet', async () => {
      AsyncStorageStub.getItem.resolves(undefined);
      await db.restore(AsyncStorageStub);
      expect(store.settings.unit, 'to equal', 'sat');
      expect(logger.error, 'was not called');
      expect(store.loaded, 'to be', true);
    });

    it('should set supported setting', async () => {
      AsyncStorageStub.getItem
        .withArgs('settings')
        .resolves(JSON.stringify({ unit: 'btc' }));
      await db.restore(AsyncStorageStub);
      expect(store.settings.unit, 'to equal', 'btc');
      expect(store.loaded, 'to be', true);
    });

    it('should set supported object', async () => {
      AsyncStorageStub.getItem.resolves(
        JSON.stringify({ exchangeRate: { usd: 0.1 } })
      );
      await db.restore(AsyncStorageStub);
      expect(store.settings.exchangeRate, 'to equal', { usd: 0.1 });
    });

    it('should not set supported setting', async () => {
      AsyncStorageStub.getItem.resolves(JSON.stringify({ invalid: 'bar' }));
      await db.restore(AsyncStorageStub);
      expect(store.settings.invalid, 'to be', undefined);
    });

    it('should log error', async () => {
      AsyncStorageStub.getItem.rejects(new Error('Boom!'));
      await db.restore(AsyncStorageStub);
      expect(logger.error, 'was called once');
      expect(store.loaded, 'to be', true);
    });
  });

  describe('save()', () => {
    it('should save all settings', async () => {
      store.settings = { foo: 'bar' };
      await db.save();
      const state = JSON.stringify(store.settings);
      expect(AsyncStorageStub.setItem, 'was called with', 'settings', state);
    });

    it('should log error', async () => {
      AsyncStorageStub.setItem.rejects(new Error('Boom!'));
      await db.save();
      expect(logger.error, 'was called once');
    });
  });

  describe('clear()', () => {
    it('should clear all settings', async () => {
      await db.clear();
      expect(AsyncStorageStub.clear, 'was called once');
    });

    it('should log error', async () => {
      AsyncStorageStub.clear.rejects(new Error('Boom!'));
      await db.clear();
      expect(logger.error, 'was called once');
    });
  });
});
