import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsChannels from '../../../src/actions/channels';

describe('Actions Channels Unit Tests', () => {
  const host = 'localhost:10011';
  const pubkey = 'pub_12345';

  let sandbox;
  let store;
  let actionsGrpc;
  let actionsChannels;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsGrpc.sendCommand.resolves({});
    actionsChannels = new ActionsChannels(store, actionsGrpc);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getChannels()', () => {
    it('should list open channels', async () => {
      actionsGrpc.sendCommand.withArgs('listChannels').resolves({
        channels: [{ chan_id: 42, active: true }],
      });
      await actionsChannels.getChannels();
      expect(store.channelsResponse, 'to satisfy', [
        { id: 42, status: 'open' },
      ]);
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsChannels.getChannels();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getPendingChannels()', () => {
    it('should list open channels', async () => {
      actionsGrpc.sendCommand.withArgs('pendingChannels').resolves({
        pending_open_channels: [{}],
        pending_closing_channels: [{}],
        pending_force_closing_channels: [{}],
      });
      await actionsChannels.getPendingChannels();
      expect(store.pendingChannelsResponse.length, 'to equal', 3);
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsChannels.getPendingChannels();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getPeers()', () => {
    it('should list peers', async () => {
      actionsGrpc.sendCommand.withArgs('listPeers').resolves({
        peers: [{ pub_key: 'foo' }],
      });
      await actionsChannels.getPeers();
      expect(store.peersResponse[0].pubKey, 'to equal', 'foo');
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsChannels.getPeers();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('connectToPeer()', () => {
    it('should list peers after connecting', async () => {
      actionsGrpc.sendCommand.withArgs('connectPeer').resolves();
      actionsGrpc.sendCommand.withArgs('listPeers').resolves();
      await actionsChannels.connectToPeer(host, pubkey);
      expect(actionsGrpc.sendCommand, 'was called with', 'listPeers');
    });
  });

  describe('openChannel()', () => {
    beforeEach(() => {
      sandbox.stub(actionsChannels, 'getChannels');
      sandbox.stub(actionsChannels, 'getPendingChannels');
    });

    it('should call getPendingChannels() on chan_pending data event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('data').yields({ chan_pending: {} });
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand.withArgs('openChannel').resolves({
        on: onStub,
      });
      await actionsChannels.openChannel(host, pubkey);
      expect(actionsChannels.getPendingChannels, 'was called once');
    });

    it('should call getChannels() on chan_open data event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('data').yields({ chan_open: {} });
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand.withArgs('openChannel').resolves({
        on: onStub,
      });
      await actionsChannels.openChannel(host, pubkey);
      expect(actionsChannels.getChannels, 'was called once');
    });

    it('should reject in case of error event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('error').yields(new Error('Boom!'));
      actionsGrpc.sendStreamCommand.withArgs('openChannel').resolves({
        on: onStub,
      });
      await expect(
        actionsChannels.openChannel(host, pubkey),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
