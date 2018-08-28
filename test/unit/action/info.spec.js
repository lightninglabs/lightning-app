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

  describe('getNetworkInfo()', () => {
    it('should set number of nodes', async () => {
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 2,
      });
      await info.getNetworkInfo();
      expect(store.numNodes, 'to equal', 2);
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await info.getNetworkInfo();
      expect(logger.error, 'was called once');
    });
  });

  describe('getInfo()', () => {
    it('should get public key, synced to chain, and block height', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        identity_pubkey: 'some-pubkey',
        synced_to_chain: true,
        block_height: 'some-height',
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 2,
      });
      await info.getInfo();
      expect(store.pubKey, 'to equal', 'some-pubkey');
      expect(store.syncedToChain, 'to be', true);
      expect(store.isSyncing, 'to be', false);
      expect(store.blockHeight, 'to equal', 'some-height');
    });

    it('should return true if chain and filter headers are synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: true,
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 2,
      });
      const synced = await info.getInfo();
      expect(synced, 'to be', true);
    });

    it('should return false if chain is synced network info failed', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: true,
      });
      grpc.sendCommand.withArgs('getNetworkInfo').rejects(new Error('Boom!'));
      const synced = await info.getInfo();
      expect(synced, 'to be', false);
      expect(logger.error, 'was called once');
    });

    it('should return false if chain is synced but not filter headers', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: true,
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 1,
      });
      const synced = await info.getInfo();
      expect(synced, 'to be', false);
    });

    it('should return false if chain is not synced but filter headers are', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 2,
      });
      const synced = await info.getInfo();
      expect(synced, 'to be', false);
    });

    it('should set percentSynced', async () => {
      const testTimestamp = new Date().getTime();
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
        best_header_timestamp: testTimestamp / 1000,
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 2,
      });
      await info.getInfo();
      expect(store.percentSynced, 'to be within', 0, 1);
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
        synced_to_chain: 'true',
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 2,
      });
      await info.getInfo();
      info.initLoaderSyncing();
      expect(nav.goHome, 'was called once');
    });

    it('should navigate from loader to home on synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 1,
      });
      await info.getInfo();
      info.initLoaderSyncing();
      expect(nav.goLoaderSyncing, 'was called once');
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: true,
      });
      grpc.sendCommand.withArgs('getNetworkInfo').resolves({
        num_nodes: 2,
      });
      await info.getInfo();
      expect(nav.goHome, 'was called once');
    });
  });
});
