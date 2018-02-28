import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import * as logger from '../../../src/actions/logs';
import ActionsNav from '../../../src/actions/nav';
import ActionsInfo from '../../../src/actions/info';
import ActionsWallet from '../../../src/actions/wallet';
import ActionsChannels from '../../../src/actions/channels';
import ActionsTransactions from '../../../src/actions/transactions';
import ActionsPayments from '../../../src/actions/payments';
import ComputedWallet from '../../../src/computed/wallet';
import ComputedTransactions from '../../../src/computed/transactions';
import ComputedChannels from '../../../src/computed/channels';
import rmdir from './rmdir';

const {
  createGrpcClient,
  startLndProcess,
  startBtcdProcess,
  mineBlocks,
} = require('../../../public/lnd-child-process');

/* eslint-disable no-unused-vars */

const isDev = true;
const BTCD_DATA_DIR = 'test/data/btcd_data';
const BTCD_LOG_DIR = 'test/data/btcd_log';
const LND_DATA_DIR_1 = 'test/data/lnd_data_1';
const LND_DATA_DIR_2 = 'test/data/lnd_data_2';
const LND_LOG_DIR_1 = 'test/data/lnd_log_1';
const LND_LOG_DIR_2 = 'test/data/lnd_log_2';
const LND_PORT_1 = 10001;
const LND_PORT_2 = 10002;
const LND_PEER_PORT_1 = 10011;
const LND_PEER_PORT_2 = 10012;
const LND_REST_PORT_1 = 8001;
const LND_REST_PORT_2 = 8002;
const HOST_1 = `localhost:${LND_PEER_PORT_1}`;
const HOST_2 = `localhost:${LND_PEER_PORT_2}`;
const MACAROONS_ENABLED = false;
const NAP_TIME = process.env.NAP_TIME || 5000;

describe('Actions Integration Tests', function() {
  this.timeout(300000);

  let store1;
  let store2;
  let sandbox;
  let lndProcess1;
  let lndProcess2;
  let btcdProcess;
  let navStub1;
  let grpc1;
  let info1;
  let wallet1;
  let channels1;
  let transactions1;
  let payments1;
  let navStub2;
  let grpc2;
  let info2;
  let wallet2;
  let channels2;
  let transactions2;
  let payments2;
  let btcdArgs;
  let payReq;

  before(async () => {
    rmdir('test/data');
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store1 = observable({ lndReady: false, loaded: false });
    store2 = observable({ lndReady: false, loaded: false });

    ComputedWallet(store1);
    ComputedWallet(store2);
    ComputedTransactions(store1);
    ComputedTransactions(store2);
    ComputedChannels(store1);
    ComputedChannels(store2);

    const globalStub1 = {};
    const remoteStub1 = { getGlobal: arg => globalStub1[arg] };
    const globalStub2 = {};
    const remoteStub2 = { getGlobal: arg => globalStub2[arg] };

    btcdArgs = {
      isDev,
      logger,
      btcdLogDir: BTCD_LOG_DIR,
      btcdDataDir: BTCD_DATA_DIR,
    };
    btcdProcess = await startBtcdProcess(btcdArgs);
    await nap(NAP_TIME);
    const lndProcess1Promise = startLndProcess({
      isDev,
      macaroonsEnabled: MACAROONS_ENABLED,
      lndDataDir: LND_DATA_DIR_1,
      lndLogDir: LND_LOG_DIR_1,
      lndPort: LND_PORT_1,
      lndPeerPort: LND_PEER_PORT_1,
      lndRestPort: LND_REST_PORT_1,
      logger,
    });
    const lndProcess2Promise = startLndProcess({
      isDev,
      macaroonsEnabled: MACAROONS_ENABLED,
      lndDataDir: LND_DATA_DIR_2,
      lndLogDir: LND_LOG_DIR_2,
      lndPort: LND_PORT_2,
      lndPeerPort: LND_PEER_PORT_2,
      lndRestPort: LND_REST_PORT_2,
      logger,
    });

    lndProcess1 = await lndProcess1Promise;
    lndProcess2 = await lndProcess2Promise;

    const createGrpcClient1Promise = createGrpcClient({
      global: globalStub1,
      lndPort: LND_PORT_1,
      lndDataDir: LND_DATA_DIR_1,
      macaroonsEnabled: MACAROONS_ENABLED,
    });
    const createGrpcClient2Promise = createGrpcClient({
      global: globalStub2,
      lndPort: LND_PORT_2,
      lndDataDir: LND_DATA_DIR_2,
      macaroonsEnabled: MACAROONS_ENABLED,
    });

    await createGrpcClient1Promise;
    await createGrpcClient2Promise;

    navStub1 = sinon.createStubInstance(ActionsNav);
    grpc1 = new ActionsGrpc(store1, remoteStub1);
    info1 = new ActionsInfo(store1, grpc1);
    wallet1 = new ActionsWallet(store1, grpc1, navStub1);
    channels1 = new ActionsChannels(store1, grpc1);
    transactions1 = new ActionsTransactions(store1, grpc1);
    payments1 = new ActionsPayments(store1, grpc1, wallet1);

    navStub2 = sinon.createStubInstance(ActionsNav);
    grpc2 = new ActionsGrpc(store2, remoteStub2);
    info2 = new ActionsInfo(store2, grpc2);
    wallet2 = new ActionsWallet(store2, grpc2, navStub2);
    channels2 = new ActionsChannels(store2, grpc2);
    transactions2 = new ActionsTransactions(store2, grpc2);
    payments2 = new ActionsPayments(store2, grpc2, wallet2);

    while (!store1.lndReady || !store2.lndReady) await nap(100);
  });

  after(() => {
    lndProcess1.kill();
    lndProcess2.kill();
    btcdProcess.kill();
    sandbox.restore();
  });

  describe('Wallet and Info actions', () => {
    it('should create new address for node1', async () => {
      await wallet1.getNewAddress();
      expect(store1.walletAddress, 'to be ok');
    });

    it('should fund wallet for node1', async () => {
      btcdProcess.kill();
      btcdArgs.miningAddress = store1.walletAddress;
      btcdProcess = await startBtcdProcess(btcdArgs);
      await nap(NAP_TIME);
      await mineAndSync({ blocks: 400 });
    });

    it('should get public key node1', async () => {
      await info1.getInfo();
      expect(store1.pubKey, 'to be ok');
    });

    it('should wait until node1 is synced to chain', async () => {
      while (!store1.syncedToChain) await nap(100);
      expect(store1.syncedToChain, 'to be true');
    });

    it('should create new address for node2', async () => {
      await wallet2.getNewAddress();
      expect(store2.walletAddress, 'to be ok');
    });

    it('should send some on-chain funds to node2', async () => {
      await payments1.sendCoins({
        addr: store2.walletAddress,
        amount: 1000000000,
      });
      await mineAndSync({ blocks: 6 });
    });

    it('should get public key node2', async () => {
      await info2.getInfo();
      expect(store2.pubKey, 'to be ok');
    });

    it('should wait until node2 is synced to chain', async () => {
      while (!store2.syncedToChain) await nap(100);
      expect(store2.syncedToChain, 'to be true');
    });

    it('should have no satoshis in channel balance', async () => {
      await updateBalances();
      expect(store1.balanceSatoshis, 'to be positive');
      expect(store2.balanceSatoshis, 'to be positive');
      expect(store1.channelBalanceSatoshis, 'to be', 0);
      expect(store2.channelBalanceSatoshis, 'to be', 0);
    });
  });

  describe('Channel and Payment actions', () => {
    it('should list no peers initially', async () => {
      await channels1.getPeers();
      expect(store1.peersResponse, 'to equal', []);
    });

    it('should list no pending channels initially', async () => {
      await channels1.getPendingChannels();
      expect(store1.pendingChannelsResponse, 'to equal', []);
    });

    it('should list no open channels initially', async () => {
      await channels1.getChannels();
      expect(store1.channelsResponse, 'to equal', []);
    });

    it('should connect to peer', async () => {
      await channels1.connectToPeer(HOST_2, store2.pubKey);
      expect(store1.peersResponse[0].pubKey, 'to be', store2.pubKey);
    });

    it('should list pending open channel after opening', async () => {
      channels1.openChannel(store2.pubKey, 1000000);
      while (!store1.pendingChannelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'pending-open');
    });

    it('should list open channel after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannelsResponse.length) await nap(100);
      while (!store1.channelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'open');
    });

    it('should have enough satoshis in channel balance', async () => {
      await updateBalances();
      expect(store1.channelBalanceSatoshis, 'to be positive');
      expect(store2.channelBalanceSatoshis, 'to be', 0);
    });

    it('should generate payment request', async () => {
      payReq = await wallet2.generatePaymentRequest(100, 'coffee');
      expect(payReq, 'to match', /^lightning:/);
    });

    it('should send lightning payment from request', async () => {
      await payments1.payLightning(payReq);
    });

    it('should have satoshis in node2 channel balance after payment', async () => {
      await updateBalances();
      expect(store2.channelBalanceSatoshis, 'to be', 100);
    });

    it('should list pending-closing channel after closing', async () => {
      channels1.closeChannel(store1.computedChannels[0]);
      while (!store1.pendingChannelsResponse.length) await nap(100);
      while (store1.channelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'pending-closing');
    });

    it('should list no channels after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 0);
    });

    it('should list pending open channel after opening', async () => {
      channels1.openChannel(store2.pubKey, 1000000);
      while (!store1.pendingChannelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'pending-open');
    });

    it('should list open channel after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannelsResponse.length) await nap(100);
      while (!store1.channelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'open');
    });

    it('should list pending-force-closing after force closing', async () => {
      channels1.closeChannel(store1.channelsResponse[0], true);
      while (!store1.pendingChannelsResponse.length) await nap(100);
      while (store1.channelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(
        store1.computedChannels[0].status,
        'to be',
        'pending-force-closing'
      );
    });

    it('should list no channels after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannelsResponse.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 0);
    });
  });

  const mineAndSync = async ({ blocks }) => {
    await mineBlocks({ blocks, logger });
    await info1.getInfo();
    await info2.getInfo();
    while (!store1.syncedToChain || !store2.syncedToChain) await nap(100);
  };

  const updateBalances = async () => {
    await wallet1.getBalance();
    await wallet1.getChannelBalance();
    await wallet2.getBalance();
    await wallet2.getChannelBalance();
  };
});
