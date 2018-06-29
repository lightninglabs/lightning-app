import { Store } from '../../src/store';
import * as logger from '../../src/action/log';

describe('Store Unit Tests', () => {
  let sandbox;
  let store;
  let AsyncStorageStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    AsyncStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      clear: sinon.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('init()', () => {
    it('set computed vales', () => {
      expect(store.unitLabel, 'to be', undefined);
      store.init();
      expect(store.unitLabel, 'to equal', 'BTC');
    });
  });

  describe('restore()', () => {
    it('should set supported setting', async () => {
      AsyncStorageStub.getItem
        .withArgs('settings')
        .resolves(JSON.stringify({ unit: 'sat' }));
      await store.restore(AsyncStorageStub);
      expect(store.settings.unit, 'to equal', 'sat');
      expect(store.loaded, 'to be', true);
    });

    it('should set supported object', async () => {
      AsyncStorageStub.getItem.resolves(
        JSON.stringify({ exchangeRate: { usd: 0.1 } })
      );
      await store.restore(AsyncStorageStub);
      expect(store.settings.exchangeRate, 'to equal', { usd: 0.1 });
    });

    it('should not set supported setting', async () => {
      AsyncStorageStub.getItem.resolves(JSON.stringify({ invalid: 'bar' }));
      await store.restore(AsyncStorageStub);
      expect(store.settings.invalid, 'to be', undefined);
    });

    it('should log error', async () => {
      AsyncStorageStub.getItem.rejects(new Error('Boom!'));
      await store.restore(AsyncStorageStub);
      expect(logger.error, 'was called once');
      expect(store.loaded, 'to be', true);
    });
  });

  describe('save()', () => {
    beforeEach(() => {
      store._AsyncStorage = AsyncStorageStub;
    });

    it('should save all settings', async () => {
      store.settings = { foo: 'bar' };
      await store.save();
      const state = JSON.stringify(store.settings);
      expect(AsyncStorageStub.setItem, 'was called with', 'settings', state);
    });

    it('should log error', async () => {
      AsyncStorageStub.setItem.rejects(new Error('Boom!'));
      await store.save();
      expect(logger.error, 'was called once');
    });
  });

  describe('clear()', () => {
    beforeEach(() => {
      store._AsyncStorage = AsyncStorageStub;
    });

    it('should clear all settings', async () => {
      await store.clear();
      expect(AsyncStorageStub.clear, 'was called once');
    });

    it('should log error', async () => {
      AsyncStorageStub.clear.rejects(new Error('Boom!'));
      await store.clear();
      expect(logger.error, 'was called once');
    });
  });
});
