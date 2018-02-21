import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsInfo from '../../../src/actions/info';

describe('Actions Info Unit Tests', () => {
  let store;
  let actionsGrpc;
  let actionsInfo;

  beforeEach(() => {
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsGrpc.sendCommand.resolves({});
    actionsInfo = new ActionsInfo(store, actionsGrpc);
  });

  describe('getInfo()', () => {
    it('should get public key, synced to chain, and block height', async () => {
      actionsGrpc.sendCommand.withArgs('getInfo').resolves({
        identity_pubkey: 'some-pubkey',
        synced_to_chain: 'true/false',
        block_height: 'some-height',
      });
      await actionsInfo.getInfo();
      expect(store.pubKey, 'to equal', 'some-pubkey');
      expect(store.syncedToChain, 'to equal', 'true/false');
      expect(store.blockHeight, 'to equal', 'some-height');
    });

    it('should only call once if chain is synced', async () => {
      actionsGrpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: true,
      });
      await actionsInfo.getInfo();
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to equal', 1);
    });

    it('should retry if chain is not synced', async () => {
      actionsGrpc.sendCommand.withArgs('getInfo').resolves({
        synced_to_chain: false,
      });
      await actionsInfo.getInfo();
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsInfo.getInfo();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });
});
