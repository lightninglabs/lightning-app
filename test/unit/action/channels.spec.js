import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import ChannelAction from '../../../src/action/channels';
import NotificationAction from '../../../src/action/notification';
import * as logger from '../../../src/action/logs';

describe('Action Channels Unit Tests', () => {
  const host = 'localhost:10011';
  const pubkey = 'pub_12345';
  const amount = 100000;

  let sandbox;
  let store;
  let grpc;
  let channel;
  let notification;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    notification = sinon.createStubInstance(NotificationAction);
    channel = new ChannelAction(store, grpc, notification);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('pollChannels()', () => {
    beforeEach(() => {
      sandbox.stub(channel, 'getChannels');
    });

    afterEach(() => {
      clearTimeout(channel.tpollChannels);
    });

    it('should poll when called', async () => {
      channel.getChannels.resolves();
      await channel.pollChannels();
      await nap(30);
      expect(channel.getChannels.callCount, 'to be greater than', 1);
    });

    it('should log error on failure', async () => {
      channel.getChannels.rejects(new Error('Boom!'));
      await channel.pollChannels();
      expect(logger.error, 'was called');
    });
  });

  describe('getChannels()', () => {
    it('should list open channels', async () => {
      grpc.sendCommand.withArgs('listChannels').resolves({
        channels: [{ chan_id: 42, active: true }],
      });
      await channel.getChannels();
      expect(store.channels[0], 'to satisfy', {
        id: 42,
        status: 'open',
      });
    });
  });

  describe('pollPendingChannels()', () => {
    beforeEach(() => {
      sandbox.stub(channel, 'getPendingChannels');
    });

    afterEach(() => {
      clearTimeout(channel.tpPending);
    });

    it('should poll when called', async () => {
      channel.getPendingChannels.resolves();
      await channel.pollPendingChannels();
      await nap(30);
      expect(channel.getPendingChannels.callCount, 'to be greater than', 1);
    });

    it('should log error on failure', async () => {
      channel.getPendingChannels.rejects(new Error('Boom!'));
      await channel.pollPendingChannels();
      expect(logger.error, 'was called');
    });
  });

  describe('getPendingChannels()', () => {
    it('should list pending channels', async () => {
      grpc.sendCommand.withArgs('pendingChannels').resolves({
        pending_open_channels: [{}],
        pending_closing_channels: [{}],
        pending_force_closing_channels: [{}],
      });
      await channel.getPendingChannels();
      expect(store.pendingChannels.length, 'to equal', 3);
    });
  });

  describe('pollPeers()', () => {
    beforeEach(() => {
      sandbox.stub(channel, 'getPeers');
    });

    afterEach(() => {
      clearTimeout(channel.tgetPeers);
    });

    it('should poll when called', async () => {
      channel.getPeers.resolves();
      await channel.pollPeers();
      await nap(30);
      expect(channel.getPeers.callCount, 'to be greater than', 1);
    });

    it('should log error on failure', async () => {
      channel.getPeers.rejects(new Error('Boom!'));
      await channel.pollPeers();
      expect(logger.error, 'was called');
    });
  });

  describe('getPeers()', () => {
    it('should list peers', async () => {
      grpc.sendCommand.withArgs('listPeers').resolves({
        peers: [{ pub_key: 'foo' }],
      });
      await channel.getPeers();
      expect(store.peers[0].pubKey, 'to equal', 'foo');
    });
  });

  describe('connectAndOpen()', () => {
    beforeEach(() => {
      sandbox.stub(channel, 'openChannel');
      sandbox.stub(channel, 'getPeers');
      grpc.sendCommand.withArgs('connectPeer').resolves();
    });

    it('should connect to peer and open channel', async () => {
      await channel.connectAndOpen({
        pubkeyAtHost: `${pubkey}@${host}`,
        amount,
      });
      expect(grpc.sendCommand, 'was called with', 'connectPeer', {
        addr: { host, pubkey },
      });
      expect(channel.openChannel, 'was called with', {
        pubkey,
        amount,
      });
    });

    it('should try to open channel if connect fails', async () => {
      grpc.sendCommand.withArgs('connectPeer').rejects(new Error('Boom!'));
      await channel.connectAndOpen({
        pubkeyAtHost: `${pubkey}@${host}`,
        amount,
      });
      expect(notification.display, 'was called once');
      expect(channel.openChannel, 'was called once');
    });

    it('should display notification twice if both fail', async () => {
      grpc.sendCommand.withArgs('connectPeer').rejects(new Error('Boom!'));
      channel.openChannel.rejects(new Error('Boom!'));
      await channel.connectAndOpen({
        pubkeyAtHost: `${pubkey}@${host}`,
        amount,
      });
      expect(notification.display, 'was called twice');
    });
  });

  describe('connectToPeer()', () => {
    it('should list peers after connecting', async () => {
      grpc.sendCommand.withArgs('connectPeer').resolves();
      grpc.sendCommand.withArgs('listPeers').resolves({ peers: [] });
      await channel.connectToPeer({ host, pubkey });
      expect(grpc.sendCommand, 'was called with', 'listPeers');
    });

    it('should display error notification', async () => {
      grpc.sendCommand.withArgs('connectPeer').rejects(new Error('Boom!'));
      await channel.connectToPeer({
        host,
        pubkey,
      });
      expect(notification.display, 'was called once');
    });
  });

  describe('openChannel()', () => {
    beforeEach(() => {
      sandbox.stub(channel, 'getChannels');
      sandbox.stub(channel, 'getPendingChannels');
    });

    it('should update pending and open channels on data event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('data').yields({});
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand.withArgs('openChannel').returns({
        on: onStub,
      });
      await channel.openChannel({ pubkey, amount });
      expect(channel.getPendingChannels, 'was called once');
      expect(channel.getChannels, 'was called once');
    });

    it('should reject in case of error event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('error').yields(new Error('Boom!'));
      grpc.sendStreamCommand.withArgs('openChannel').returns({
        on: onStub,
      });
      await expect(
        channel.openChannel({ pubkey, amount }),
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
      sandbox.stub(channel, 'getChannels');
      sandbox.stub(channel, 'getPendingChannels');
      channelPoint = 'FFFF:1';
    });

    it('should update pending/open channels on close_pending', async () => {
      onStub.withArgs('data').yields({ close_pending: {} });
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('closeChannel', {
          channel_point: { funding_txid_str: 'FFFF', output_index: 1 },
          force: false,
        })
        .returns({ on: onStub });
      await channel.closeChannel({ channelPoint });
      expect(channel.getPendingChannels, 'was called once');
      expect(channel.getChannels, 'was called once');
    });

    it('should remove pending channel with txid on chan_close (force close)', async () => {
      store.pendingChannels = [{ closingTxid: 'abcd' }];
      const chan_close = { closing_txid: new Buffer('cdab', 'hex') };
      onStub.withArgs('data').yields({ chan_close });
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('closeChannel', {
          channel_point: { funding_txid_str: 'FFFF', output_index: 1 },
          force: true,
        })
        .returns({ on: onStub });
      await channel.closeChannel({ channelPoint, force: true });
      expect(store.pendingChannels, 'to be empty');
    });

    it('should reject for invalid channel point', async () => {
      channelPoint = 'asdf';
      await expect(
        channel.closeChannel({ channelPoint }),
        'to be rejected with error satisfying',
        /Invalid channel point/
      );
    });

    it('should reject in case of error event', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      grpc.sendStreamCommand.withArgs('closeChannel').returns({
        on: onStub,
      });
      await expect(
        channel.closeChannel({ channelPoint }),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
