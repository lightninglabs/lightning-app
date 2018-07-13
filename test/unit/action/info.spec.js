import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import NavAction from '../../../src/action/nav';
import NotificationAction from '../../../src/action/notification';
import InfoAction from '../../../src/action/info';
import * as logger from '../../../src/action/log';
import { nap } from '../../../src/helper';

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
    clearTimeout(info.t3);
    sandbox.restore();
  });

  describe('getInfo()', () => {
    it('should get public key, synced to chain, and block height', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        identity_pubkey: 'some-pubkey',
        synced_to_chain: 'true/false',
        block_height: 'some-height',
      });
      await info.getInfo();
      expect(store.pubKey, 'to equal', 'some-pubkey');
      expect(store.syncedToChain, 'to equal', 'true/false');
      expect(store.blockHeight, 'to equal', 'some-height');
    });

    it('should only call once if chain is synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: true,
      });
      await info.getInfo();
      await nap(30);
      expect(grpc.sendCommand.callCount, 'to equal', 1);
    });

    it('should set percentSynced', async () => {
      const testTimestamp = new Date().getTime();
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
        best_header_timestamp: testTimestamp / 1000,
      });
      await info.getInfo();
      expect(store.percentSynced, 'to be within', 0, 1);
    });

    it('should retry if chain is not synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
      });
      await info.getInfo();
      await nap(30);
      expect(grpc.sendCommand.callCount, 'to be greater than', 1);
    });

    it('should retry on failure', async () => {
      grpc.sendCommand.rejects();
      await info.getInfo();
      expect(logger.error, 'was called once');
    });
  });

  describe('finishOnboarding()', () => {
    it('should navigate straight to home if synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: 'true',
      });
      await info.getInfo();
      info.finishOnboarding();
      expect(nav.goHome, 'was called once');
    });

    it('should navigate from loader to home on synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
      });
      await info.getInfo();
      info.finishOnboarding();
      expect(nav.goLoaderSyncing, 'was called once');
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: true,
      });
      await nap(10);
      expect(nav.goHome, 'was called once');
    });
  });
});
