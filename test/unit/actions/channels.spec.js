import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsChannels from '../../../src/actions/channels';

describe('Actions Channels Unit Tests', () => {
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
    it('should return peer id', async () => {
      actionsGrpc.sendCommand.withArgs('connectPeer').resolves({
        peer_id: 42,
      });
      const host = 'localhost';
      const pubkey = 'pub_12345';
      const { peerId } = await actionsChannels.connectToPeer(host, pubkey);
      expect(peerId, 'to equal', 42);
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
      actionsGrpc.sendStreamCommand.withArgs('openChannel').returns({
        on: onStub,
      });
      const host = 'localhost';
      const pubkey = 'pub_12345';
      await actionsChannels.openChannel(host, pubkey);
      expect(actionsChannels.getPendingChannels, 'was called once');
    });

    it('should call getChannels() on chan_open data event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('data').yields({ chan_open: {} });
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand.withArgs('openChannel').returns({
        on: onStub,
      });
      const host = 'localhost';
      const pubkey = 'pub_12345';
      await actionsChannels.openChannel(host, pubkey);
      expect(actionsChannels.getChannels, 'was called once');
    });

    it('should reject in case of error event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('error').yields(new Error('Boom!'));
      actionsGrpc.sendStreamCommand.withArgs('openChannel').returns({
        on: onStub,
      });
      const host = 'localhost';
      const pubkey = 'pub_12345';
      await expect(
        actionsChannels.openChannel(host, pubkey),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
