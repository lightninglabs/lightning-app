import { observable, useStrict } from 'mobx';
import GrpcAction from '../../../src/action/grpc';
import InfoAction from '../../../src/action/info';

describe('Action Info Unit Tests', () => {
  let store;
  let grpc;
  let info;

  beforeEach(() => {
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    grpc.sendCommand.resolves({});
    info = new InfoAction(store, grpc);
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

    it('should retry if chain is not synced', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
      });
      await info.getInfo();
      await nap(30);
      expect(grpc.sendCommand.callCount, 'to be greater than', 1);
    });

    it('should retry on failure', async () => {
      grpc.sendCommand.onFirstCall().rejects();
      await info.getInfo();
      grpc.sendCommand.resolves({});
      await nap(30);
      expect(grpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });
});
