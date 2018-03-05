import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsChannels from '../../../src/actions/channels';
import * as logger from '../../../src/actions/logs';

describe('Actions Channels Unit Tests', () => {
  const host = 'localhost:10011';
  const pubkey = 'pub_12345';

  let sandbox;
  let store;
  let actionsGrpc;
  let actionsChannels;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
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

  describe('pollChannels()', () => {
    let response;

    beforeEach(() => {
      response = { channels: [{ chan_id: 42, active: true }] };
    });

    afterEach(() => {
      clearTimeout(actionsChannels.tpollChannels);
    });

    it('should list open channels', async () => {
      actionsGrpc.sendCommand.withArgs('listChannels').resolves(response);
      await actionsChannels.pollChannels();
      expect(store.channelsResponse, 'to satisfy', [
        { id: 42, status: 'open' },
      ]);
    });

    it('should poll when called', async () => {
      actionsGrpc.sendCommand.withArgs('listChannels').resolves(response);
      await actionsChannels.pollChannels();
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });

    it('should log error on failure', async () => {
      actionsGrpc.sendCommand.rejects(new Error('Boom!'));
      await actionsChannels.pollChannels();
      expect(logger.error, 'was called');
    });
  });

  describe('pollPendingChannels()', () => {
    let response;

    beforeEach(() => {
      response = {
        pending_open_channels: [{}],
        pending_closing_channels: [{}],
        pending_force_closing_channels: [{}],
      };
    });

    afterEach(() => {
      clearTimeout(actionsChannels.tpPending);
    });

    it('should list open channels', async () => {
      actionsGrpc.sendCommand.withArgs('pendingChannels').resolves(response);
      await actionsChannels.pollPendingChannels();
      expect(store.pendingChannelsResponse.length, 'to equal', 3);
    });

    it('should poll when called', async () => {
      actionsGrpc.sendCommand.withArgs('pendingChannels').resolves(response);
      await actionsChannels.pollPendingChannels();
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });

    it('should log error on failure', async () => {
      actionsGrpc.sendCommand.rejects(new Error('Boom!'));
      await actionsChannels.pollPendingChannels();
      expect(logger.error, 'was called');
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
      sandbox.stub(actionsChannels, 'pollChannels');
      sandbox.stub(actionsChannels, 'pollPendingChannels');
    });

    it('should update pending and open channels on data event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('data').yields({});
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand.withArgs('openChannel').resolves({
        on: onStub,
      });
      await actionsChannels.openChannel(host, pubkey);
      expect(actionsChannels.pollPendingChannels, 'was called once');
      expect(actionsChannels.pollChannels, 'was called once');
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

  describe('closeChannel()', () => {
    let onStub;
    let channel;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(actionsChannels, 'pollChannels');
      sandbox.stub(actionsChannels, 'pollPendingChannels');
      channel = { channelPoint: 'FFFF:1' };
    });

    it('should update pending/open channels on close_pending', async () => {
      onStub.withArgs('data').yields({ close_pending: {} });
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand
        .withArgs('closeChannel', {
          channel_point: { funding_txid_str: 'FFFF', output_index: 1 },
          force: false,
        })
        .resolves({ on: onStub });
      await actionsChannels.closeChannel(channel);
      expect(actionsChannels.pollPendingChannels, 'was called once');
      expect(actionsChannels.pollChannels, 'was called once');
    });

    it('should remove pending channel with txid on chan_close (force close)', async () => {
      store.pendingChannelsResponse = [{ closingTxid: 'abcd' }];
      const chan_close = { closing_txid: new Buffer('cdab', 'hex') };
      onStub.withArgs('data').yields({ chan_close });
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand
        .withArgs('closeChannel', {
          channel_point: { funding_txid_str: 'FFFF', output_index: 1 },
          force: true,
        })
        .resolves({ on: onStub });
      await actionsChannels.closeChannel(channel, true);
      expect(store.pendingChannelsResponse, 'to equal', []);
    });

    it('should reject for invalid channel point', async () => {
      channel.channelPoint = 'asdf';
      await expect(
        actionsChannels.closeChannel(channel),
        'to be rejected with error satisfying',
        /Invalid channel point/
      );
    });

    it('should reject in case of error event', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      actionsGrpc.sendStreamCommand.withArgs('closeChannel').resolves({
        on: onStub,
      });
      await expect(
        actionsChannels.closeChannel(channel),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
