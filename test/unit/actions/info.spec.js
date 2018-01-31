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

  describe('constructor()', () => {
    it('should get info on lndReady', () => {
      expect(actionsGrpc.sendCommand, 'was not called');
      store.lndReady = true;
      expect(actionsGrpc.sendCommand, 'was called with', 'getInfo');
    });
  });

  describe('getInfo()', () => {
    it('should get public key', async () => {
      actionsGrpc.sendCommand.withArgs('getInfo').resolves({
        identity_pubkey: 'some-pubkey',
      });
      await actionsInfo.getInfo();
      expect(store.pubKey, 'to equal', 'some-pubkey');
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsInfo.getInfo();
      actionsGrpc.sendCommand.resolves({});
      await new Promise(resolve => setTimeout(resolve, 30));
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });
});
