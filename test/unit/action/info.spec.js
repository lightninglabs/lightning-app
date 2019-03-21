import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import NavAction from '../../../src/action/nav';
import NotificationAction from '../../../src/action/notification';
import InfoAction from '../../../src/action/info';
import * as logger from '../../../src/action/log';

describe('Action Info Unit Tests', () => {
  let sandbox;
  let store;
  let nav;
  let grpc;
  let info;
  let notification;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    nav = sinon.createStubInstance(NavAction);
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    grpc.sendCommand.resolves({});
    notification = sinon.createStubInstance(NotificationAction);
    info = new InfoAction(store, grpc, nav, notification);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getInfo()', () => {
    it('should get public key, synced to chain, block height, and network', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        identityPubkey: 'some-pubkey',
        syncedToChain: 'true/false',
        blockHeight: 'some-height',
        chains: [{ network: 'testnet' }],
      });
      await info.getInfo();
      expect(store.pubKey, 'to equal', 'some-pubkey');
      expect(store.syncedToChain, 'to equal', 'true/false');
      expect(store.blockHeight, 'to equal', 'some-height');
      expect(store.network, 'to equal', 'testnet');
    });

    it('should show notification if syncing', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: false,
        blockHeight: 1234,
        chains: [{ network: 'testnet' }],
      });
      await info.getInfo();
      expect(notification.display, 'was called once');
      expect(notification.display, 'was called with', {
        msg: 'Syncing to chain (block: 1234)',
        wait: true,
      });
    });

    it('should show completed notification if synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: true,
        chains: [{ network: 'testnet' }],
      });
      await info.getInfo();
      expect(notification.display, 'was called once');
      expect(notification.display, 'was called with', {
        type: 'success',
        msg: 'Syncing complete',
      });
    });

    it('should return true if chain is synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: true,
        chains: [{ network: 'testnet' }],
      });
      const synced = await info.getInfo();
      expect(synced, 'to be', true);
    });

    it('should set percentSynced', async () => {
      const testTimestamp = new Date().getTime();
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: false,
        best_header_timestamp: testTimestamp / 1000,
        chains: [{ network: 'testnet' }],
      });
      await info.getInfo();
      expect(store.percentSynced, 'to be within', 0, 1);
    });

    it('should return false if chain is not synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: false,
        chains: [{ network: 'testnet' }],
      });
      const synced = await info.getInfo();
      expect(synced, 'to be', false);
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await info.getInfo();
      expect(logger.error, 'was called once');
    });
  });

  describe('pollInfo()', () => {
    it('should poll wallet balances', async () => {
      sandbox.stub(info, 'getInfo');
      info.getInfo.onSecondCall().resolves(true);
      await info.pollInfo();
      expect(info.getInfo, 'was called twice');
    });
  });

  describe('initLoaderSyncing()', () => {
    it('should navigate straight to home if synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: 'true',
      });
      await info.getInfo();
      info.initLoaderSyncing();
      expect(nav.goHome, 'was called once');
    });

    it('should navigate from loader to home on synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: false,
      });
      await info.getInfo();
      info.initLoaderSyncing();
      expect(nav.goLoaderSyncing, 'was called once');
      grpc.sendCommand.withArgs('getInfo').resolves({
        syncedToChain: true,
      });
      await info.getInfo();
      expect(nav.goHome, 'was called once');
    });
  });
});
