import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import * as logger from '../../../src/actions/logs';
import ActionsNav from '../../../src/actions/nav';
import ActionsInfo from '../../../src/actions/info';
import ActionsWallet from '../../../src/actions/wallet';
import ActionsChannels from '../../../src/actions/channels';
import ActionsTransactions from '../../../src/actions/transactions';
import ActionsPayments from '../../../src/actions/payments';
import rmdir from './rmdir';

const {
  createGrpcClient,
  startLndProcess,
  startBtcdProcess,
  mineBlocks,
} = require('../../../public/lnd-child-process');

/* eslint-disable no-unused-vars */

const isDev = true;
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
const NAP_TIME = 5000;

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

  before(async () => {
    rmdir('test/data');
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store1 = observable({ lndReady: false, loaded: false });
    store2 = observable({ lndReady: false, loaded: false });
    const globalStub1 = {};
    const remoteStub1 = { getGlobal: arg => globalStub1[arg] };
    const globalStub2 = {};
    const remoteStub2 = { getGlobal: arg => globalStub2[arg] };

    btcdProcess = await startBtcdProcess({ isDev, logger });
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
    // sandbox.restore();
  });

  describe('Wallet and Info actions', () => {
    it('should create new address for node1', async () => {
      await wallet1.getNewAddress();
      expect(store1.walletAddress, 'to be ok');
    });

    it('should fund wallet for node1', async () => {
      btcdProcess.kill();
      btcdProcess = await startBtcdProcess({
        isDev,
        logger,
        miningAddress: store1.walletAddress,
      });
      await nap(NAP_TIME);
      await mineBlocks({ blocks: 400, logger });
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

    it('should fund wallet for node2', async () => {
      btcdProcess.kill();
      btcdProcess = await startBtcdProcess({
        isDev,
        logger,
        miningAddress: store2.walletAddress,
      });
      await nap(NAP_TIME);
      await mineBlocks({ blocks: 400, logger });
    });

    it('should get public key node2', async () => {
      await info2.getInfo();
      expect(store2.pubKey, 'to be ok');
    });

    it('should wait until node2 is synced to chain', async () => {
      while (!store2.syncedToChain) await nap(100);
      expect(store2.syncedToChain, 'to be true');
    });
  });

  describe('Channel actions', () => {
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

    it('should list pending channel after opening', async () => {
      // re-enable logs from this point
      sandbox.restore();
      channels1.openChannel(store2.pubKey, 10000);
      while (!store1.pendingChannelsResponse.length) await nap(100);
      expect(store1.pendingChannelsResponse.length, 'to be', 1);
    });

    it('should list open channel after mining 6 blocks', async () => {
      await mineBlocks({ blocks: 6, logger });
      while (!store1.channelsResponse.length) await nap(100);
      expect(store1.channelsResponse[0].remotePubkey, 'to be', store2.pubKey);
    });
  });
});
