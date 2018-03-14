import { Store } from '../../../src/store';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsChannels from '../../../src/actions/channels';
import ActionsNotification from '../../../src/actions/notification';
import * as logger from '../../../src/actions/logs';

describe('Actions Channels Unit Tests', () => {
  const host = 'localhost:10011';
  const pubkey = 'pub_12345';
  const amount = 100000;

  let sandbox;
  let store;
  let actionsGrpc;
  let actionsChannels;
  let actionsNotification;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsNotification = sinon.createStubInstance(ActionsNotification);
    actionsChannels = new ActionsChannels(
      store,
      actionsGrpc,
      actionsNotification
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('pollChannels()', () => {
    beforeEach(() => {
      sandbox.stub(actionsChannels, 'getChannels');
    });

    afterEach(() => {
      clearTimeout(actionsChannels.tpollChannels);
    });

    it('should poll when called', async () => {
      actionsChannels.getChannels.resolves();
      await actionsChannels.pollChannels();
      await nap(30);
      expect(actionsChannels.getChannels.callCount, 'to be greater than', 1);
    });

    it('should log error on failure', async () => {
      actionsChannels.getChannels.rejects(new Error('Boom!'));
      await actionsChannels.pollChannels();
      expect(logger.error, 'was called');
    });
  });

  describe('getChannels()', () => {
    it('should list open channels', async () => {
      actionsGrpc.sendCommand.withArgs('listChannels').resolves({
        channels: [{ chan_id: 42, active: true }],
      });
      await actionsChannels.getChannels();
      expect(store.channelsResponse[0], 'to satisfy', {
        id: 42,
        status: 'open',
      });
    });
  });

  describe('pollPendingChannels()', () => {
    beforeEach(() => {
      sandbox.stub(actionsChannels, 'getPendingChannels');
    });

    afterEach(() => {
      clearTimeout(actionsChannels.tpPending);
    });

    it('should poll when called', async () => {
      actionsChannels.getPendingChannels.resolves();
      await actionsChannels.pollPendingChannels();
      await nap(30);
      expect(
        actionsChannels.getPendingChannels.callCount,
        'to be greater than',
        1
      );
    });

    it('should log error on failure', async () => {
      actionsChannels.getPendingChannels.rejects(new Error('Boom!'));
      await actionsChannels.pollPendingChannels();
      expect(logger.error, 'was called');
    });
  });

  describe('getPendingChannels()', () => {
    it('should list pending channels', async () => {
      actionsGrpc.sendCommand.withArgs('pendingChannels').resolves({
        pending_open_channels: [{}],
        pending_closing_channels: [{}],
        pending_force_closing_channels: [{}],
      });
      await actionsChannels.getPendingChannels();
      expect(store.pendingChannelsResponse.length, 'to equal', 3);
    });
  });

  describe('pollPeers()', () => {
    beforeEach(() => {
      sandbox.stub(actionsChannels, 'getPeers');
    });

    afterEach(() => {
      clearTimeout(actionsChannels.tgetPeers);
    });

    it('should poll when called', async () => {
      actionsChannels.getPeers.resolves();
      await actionsChannels.pollPeers();
      await nap(30);
      expect(actionsChannels.getPeers.callCount, 'to be greater than', 1);
    });

    it('should log error on failure', async () => {
      actionsChannels.getPeers.rejects(new Error('Boom!'));
      await actionsChannels.pollPeers();
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
  });

  describe('connectAndOpen()', () => {
    beforeEach(() => {
      sandbox.stub(actionsChannels, 'openChannel');
      sandbox.stub(actionsChannels, 'getPeers');
      actionsGrpc.sendCommand.withArgs('connectPeer').resolves();
    });

    it('should connect to peer and open channel', async () => {
      await actionsChannels.connectAndOpen({
        pubkeyAtHost: `${pubkey}@${host}`,
        amount,
      });
      expect(actionsGrpc.sendCommand, 'was called with', 'connectPeer', {
        addr: { host, pubkey },
      });
      expect(actionsChannels.openChannel, 'was called with', {
        pubkey,
        amount,
      });
    });

    it('should try to open channel if connect fails', async () => {
      actionsGrpc.sendCommand
        .withArgs('connectPeer')
        .rejects(new Error('Boom!'));
      await actionsChannels.connectAndOpen({
        pubkeyAtHost: `${pubkey}@${host}`,
        amount,
      });
      expect(actionsNotification.display, 'was called once');
      expect(actionsChannels.openChannel, 'was called once');
    });

    it('should display notification twice if both fail', async () => {
      actionsGrpc.sendCommand
        .withArgs('connectPeer')
        .rejects(new Error('Boom!'));
      actionsChannels.openChannel.rejects(new Error('Boom!'));
      await actionsChannels.connectAndOpen({
        pubkeyAtHost: `${pubkey}@${host}`,
        amount,
      });
      expect(actionsNotification.display, 'was called twice');
    });
  });

  describe('connectToPeer()', () => {
    it('should list peers after connecting', async () => {
      actionsGrpc.sendCommand.withArgs('connectPeer').resolves();
      actionsGrpc.sendCommand.withArgs('listPeers').resolves({ peers: [] });
      await actionsChannels.connectToPeer({ host, pubkey });
      expect(actionsGrpc.sendCommand, 'was called with', 'listPeers');
    });

    it('should display error notification', async () => {
      actionsGrpc.sendCommand
        .withArgs('connectPeer')
        .rejects(new Error('Boom!'));
      await actionsChannels.connectToPeer({
        host,
        pubkey,
      });
      expect(actionsNotification.display, 'was called once');
    });
  });

  describe('openChannel()', () => {
    beforeEach(() => {
      sandbox.stub(actionsChannels, 'getChannels');
      sandbox.stub(actionsChannels, 'getPendingChannels');
    });

    it('should update pending and open channels on data event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('data').yields({});
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand.withArgs('openChannel').resolves({
        on: onStub,
      });
      await actionsChannels.openChannel({ pubkey, amount });
      expect(actionsChannels.getPendingChannels, 'was called once');
      expect(actionsChannels.getChannels, 'was called once');
    });

    it('should reject in case of error event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('error').yields(new Error('Boom!'));
      actionsGrpc.sendStreamCommand.withArgs('openChannel').resolves({
        on: onStub,
      });
      await expect(
        actionsChannels.openChannel({ pubkey, amount }),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });

  describe('closeChannel()', () => {
    let onStub;
    let channelPoint;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(actionsChannels, 'getChannels');
      sandbox.stub(actionsChannels, 'getPendingChannels');
      channelPoint = 'FFFF:1';
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
      await actionsChannels.closeChannel({ channelPoint });
      expect(actionsChannels.getPendingChannels, 'was called once');
      expect(actionsChannels.getChannels, 'was called once');
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
      await actionsChannels.closeChannel({ channelPoint, force: true });
      expect(store.pendingChannelsResponse, 'to be empty');
    });

    it('should reject for invalid channel point', async () => {
      channelPoint = 'asdf';
      await expect(
        actionsChannels.closeChannel({ channelPoint }),
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
        actionsChannels.closeChannel({ channelPoint }),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
