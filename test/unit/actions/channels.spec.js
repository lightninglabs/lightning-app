import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsChannels from '../../../src/actions/channels';

describe('Actions Channels Unit Tests', () => {
  let store;
  let actionsGrpc;
  let actionsChannels;

  beforeEach(() => {
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
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
      await new Promise(resolve => setTimeout(resolve, 30));
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
      await new Promise(resolve => setTimeout(resolve, 30));
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
      await new Promise(resolve => setTimeout(resolve, 30));
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

  describe('createChannel()', () => {
    it('should create channel', async () => {
      store.peersResponse = [{ pubKey: 'foo' }];
      const channelOnStub = sinon
        .stub()
        .withArgs('data')
        .yields({ chan_pending: { txid: 1 } });
      actionsGrpc.sendStreamCommand
        .withArgs('openChannel', {
          node_pubkey: new Buffer('pubkey', 'hex'),
          local_funding_amount: 'some-amount',
        })
        .resolves({
          on: channelOnStub,
        });
      actionsGrpc.sendStreamCommand.resolves({
        on: channelOnStub,
      });
      await actionsChannels.createChannel('pubkey@host', 'some-amount');
      expect(actionsGrpc.sendStreamCommand, 'was called with', 'openChannel', {
        node_pubkey: new Buffer('pubkey', 'hex'),
        local_funding_amount: 'some-amount',
      });
      expect(channelOnStub, 'was called');
    });
  });
});
