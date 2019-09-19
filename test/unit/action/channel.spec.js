import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import ChannelAction from '../../../src/action/channel';
import NotificationAction from '../../../src/action/notification';
import NavAction from '../../../src/action/nav';
import * as logger from '../../../src/action/log';

describe('Action Channels Unit Tests', () => {
  const host = 'localhost:10011';
  const pubkey = 'pub_12345';
  const amount = '0.001';

  let sandbox;
  let store;
  let grpc;
  let channel;
  let nav;
  let notification;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    store.settings.unit = 'btc';
    store.settings.displayFiat = false;
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    notification = sinon.createStubInstance(NotificationAction);
    nav = sinon.createStubInstance(NavAction);
    channel = new ChannelAction(store, grpc, nav, notification);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initCreate()', () => {
    it('should clear attributes and navigate to channel create view', () => {
      store.channel.pubkeyAtHost = 'foo';
      store.channel.amount = 'bar';
      channel.initCreate();
      expect(store.channel.pubkeyAtHost, 'to equal', '');
      expect(store.channel.amount, 'to equal', '');
      expect(nav.goChannelCreate, 'was called once');
    });
  });

  describe('setAmount()', () => {
    it('should set attribute', () => {
      channel.setAmount({ amount: 'some-amount' });
      expect(store.channel.amount, 'to equal', 'some-amount');
    });
  });

  describe('setPubkeyAtHost()', () => {
    it('should set attribute', () => {
      channel.setPubkeyAtHost({ pubkeyAtHost: 'some-pubkeyAtHost' });
      expect(store.channel.pubkeyAtHost, 'to equal', 'some-pubkeyAtHost');
    });
  });

  describe('init()', () => {
    it('should navigate to list', () => {
      channel.init();
      expect(nav.goChannels, 'was called once');
    });
  });

  describe('select()', () => {
    it('should set selectedChannel', () => {
      const item = 'some-channel';
      channel.select({ item });
      expect(store.selectedChannel, 'to equal', 'some-channel');
      expect(nav.goChannelDetail, 'was called once');
    });
  });

  describe('update()', () => {
    it('should refresh channels and peers', async () => {
      await channel.update();
      expect(grpc.sendCommand.callCount, 'to equal', 4);
    });
  });

  describe('pollChannels()', () => {
    it('should poll all channels', async () => {
      sandbox.stub(channel, 'update');
      channel.update.onSecondCall().resolves(true);
      await channel.pollChannels();
      expect(channel.update, 'was called twice');
    });
  });

  describe('getChannels()', () => {
    it('should list open channels', async () => {
      grpc.sendCommand.withArgs('listChannels').resolves({
        channels: [
          {
            chanId: 42,
            active: true,
            capacity: 100,
            localBalance: 10,
            remoteBalance: 90,
            commitFee: 15,
            channelPoint: 'FFFF:1',
          },
          {
            chanId: 43,
            active: false,
            capacity: 102,
            localBalance: 11,
            remoteBalance: 91,
            commitFee: 16,
            channelPoint: 'FFFF:2',
          },
        ],
      });
      await channel.getChannels();
      expect(store.channels[0], 'to satisfy', {
        id: 42,
        fundingTxId: 'FFFF',
        status: 'open',
        commitFee: 15,
      });
      expect(store.channels[1], 'to satisfy', {
        id: 43,
        fundingTxId: 'FFFF',
        status: 'open',
        commitFee: 16,
      });
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await channel.getChannels();
      expect(logger.error, 'was called once');
    });
  });

  describe('getPendingChannels()', () => {
    const pendingChannel = {
      remoteNodePub: 'some-key',
      capacity: 100,
      localBalance: 10,
      remoteBalance: 90,
      channelPoint: 'FFFF:1',
    };

    it('should list pending channels', async () => {
      grpc.sendCommand.withArgs('pendingChannels').resolves({
        pendingOpenChannels: [
          { channel: { ...pendingChannel }, commitFee: 15 },
        ],
        pendingClosingChannels: [{ channel: { ...pendingChannel } }],
        pendingForceClosingChannels: [
          {
            channel: { ...pendingChannel },
            blocksTilMaturity: 463,
          },
        ],
        waitingCloseChannels: [{ channel: { ...pendingChannel } }],
        totalLimboBalance: 1,
      });
      await channel.getPendingChannels();
      expect(store.pendingChannels.length, 'to equal', 4);
      expect(store.pendingChannels[0], 'to satisfy', {
        remotePubkey: 'some-key',
        fundingTxId: 'FFFF',
        commitFee: 15,
      });
      expect(store.pendingChannels[2], 'to satisfy', {
        timeTilAvailable: '3 days and 5 hours',
      });
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await channel.getPendingChannels();
      expect(logger.error, 'was called once');
    });
  });

  describe('getPeers()', () => {
    it('should list peers', async () => {
      grpc.sendCommand.withArgs('listPeers').resolves({
        peers: [{ pubKey: 'foo' }],
      });
      await channel.getPeers();
      expect(store.peers[0].pubKey, 'to equal', 'foo');
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await channel.getPeers();
      expect(logger.error, 'was called once');
    });
  });

  describe('connectAndOpen()', () => {
    beforeEach(() => {
      sandbox.stub(channel, 'openChannel');
      sandbox.stub(channel, 'getPeers');
      grpc.sendCommand.withArgs('connectPeer').resolves();
    });

    it('should connect to peer and open channel', async () => {
      channel.setPubkeyAtHost({ pubkeyAtHost: `${pubkey}@${host}` });
      channel.setAmount({ amount });
      await channel.connectAndOpen();
      expect(grpc.sendCommand, 'was called with', 'connectPeer', {
        addr: { host, pubkey },
      });
      expect(channel.openChannel, 'was called with', {
        pubkey,
        amount: 100000,
      });
      expect(nav.goChannels, 'was called once');
    });

    it('should display notification on invalid pubkeyAtHost', async () => {
      channel.setPubkeyAtHost({ pubkeyAtHost: '' });
      await channel.connectAndOpen();
      expect(notification.display, 'was called once');
      expect(grpc.sendCommand, 'was not called');
    });

    it('should try to open channel if connect fails', async () => {
      grpc.sendCommand.withArgs('connectPeer').rejects(new Error('Boom!'));
      channel.setPubkeyAtHost({ pubkeyAtHost: `${pubkey}@${host}` });
      channel.setAmount({ amount });
      await channel.connectAndOpen();
      expect(logger.info, 'was called once');
      expect(channel.openChannel, 'was called once');
    });

    it('should display notification if both fail', async () => {
      grpc.sendCommand.withArgs('connectPeer').rejects(new Error('Boom!'));
      channel.openChannel.rejects(new Error('Boom!'));
      channel.setPubkeyAtHost({ pubkeyAtHost: `${pubkey}@${host}` });
      channel.setAmount({ amount });
      await channel.connectAndOpen();
      expect(logger.info, 'was called once');
      expect(notification.display, 'was called once');
      expect(nav.goChannelCreate, 'was called once');
    });
  });

  describe('connectToPeer()', () => {
    it('should list peers after connecting', async () => {
      grpc.sendCommand.withArgs('connectPeer').resolves();
      await channel.connectToPeer({ host, pubkey });
      expect(grpc.sendCommand, 'was called with', 'connectPeer');
    });

    it('should log info in case of error', async () => {
      grpc.sendCommand.withArgs('connectPeer').rejects(new Error('Boom!'));
      await channel.connectToPeer({
        host,
        pubkey,
      });
      expect(logger.info, 'was called once');
    });
  });

  describe('openChannel()', () => {
    beforeEach(() => {
      sandbox.stub(channel, 'update');
    });

    it('should update pending and open channels on data event', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('data').yields({});
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand.withArgs('openChannel').returns({
        on: onStub,
      });
      await channel.openChannel({ pubkey, amount: 100000 });
      expect(channel.update, 'was called once');
    });

    it('should throw error', async () => {
      const onStub = sinon.stub();
      onStub.withArgs('error').yields(new Error('Boom!'));
      grpc.sendStreamCommand.withArgs('openChannel').returns({
        on: onStub,
      });
      await expect(
        channel.openChannel({ pubkey, amount: 100000 }),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });

  describe('closeSelectedChannel()', () => {
    beforeEach(() => {
      store.selectedChannel = {
        channelPoint: 'some-channel-point',
        status: 'open',
        active: true,
      };
      sandbox.stub(channel, 'closeChannel');
    });

    it('should close open channel and navigate to channels view', async () => {
      await channel.closeSelectedChannel();
      expect(nav.goChannels, 'was called once');
      expect(channel.closeChannel, 'was called with', {
        channelPoint: 'some-channel-point',
        force: false,
      });
    });

    it('should force close inactive open channel', async () => {
      store.selectedChannel.active = false;
      await channel.closeSelectedChannel();
      expect(nav.goChannels, 'was called once');
      expect(channel.closeChannel, 'was called with', {
        channelPoint: 'some-channel-point',
        force: true,
      });
    });

    it('should force close pending-open channel', async () => {
      store.selectedChannel.status = 'pending-open';
      await channel.closeSelectedChannel();
      expect(nav.goChannels, 'was called once');
      expect(channel.closeChannel, 'was called with', {
        channelPoint: 'some-channel-point',
        force: true,
      });
    });

    it('should display notification in case of error event', async () => {
      channel.closeChannel.rejects(new Error('Boom!'));
      await channel.closeSelectedChannel();
      expect(nav.goChannels, 'was called once');
      expect(notification.display, 'was called once');
    });
  });

  describe('closeChannel()', () => {
    let onStub;
    let channelPoint;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(channel, 'update');
      channelPoint = 'FFFF:1';
    });

    it('should update pending/open channels on closePending', async () => {
      onStub.withArgs('data').yields({ closePending: {} });
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('closeChannel', {
          channelPoint: { fundingTxidStr: 'FFFF', outputIndex: 1 },
          force: false,
          targetConf: 16,
        })
        .returns({ on: onStub });
      await channel.closeChannel({ channelPoint });
      expect(channel.update, 'was called once');
    });

    it('should remove pending channel on chanClose (force close)', async () => {
      store.pendingChannels = [{ channelPoint: 'FFFF:1' }];
      const chanClose = { closingTxid: Buffer.from('cdab', 'hex') };
      onStub.withArgs('data').yields({ chanClose });
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('closeChannel', {
          channelPoint: { fundingTxidStr: 'FFFF', outputIndex: 1 },
          force: true,
          targetConf: undefined,
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
