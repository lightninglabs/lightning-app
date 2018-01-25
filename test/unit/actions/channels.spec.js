import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsChannels from '../../../src/actions/channels';

describe('Actions Channels Unit Tests', () => {
  let store;
  let actionsGrpc;
  let actionsChannels;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      lndReady: false,
    });

    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsGrpc.sendCommand.resolves({});
    actionsChannels = new ActionsChannels(store, actionsGrpc);
  });

  describe('constructor()', () => {
    it('should list channels and peers on lndReady', () => {
      expect(actionsChannels._store, 'to be ok');
      expect(actionsGrpc.sendCommand, 'was not called');
      store.lndReady = true;
      expect(actionsGrpc.sendCommand, 'was called with', 'listChannels');
      expect(actionsGrpc.sendCommand, 'was called with', 'pendingChannels');
      expect(actionsGrpc.sendCommand, 'was called with', 'listPeers');
    });
  });
});
