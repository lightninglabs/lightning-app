import { rmdir, poll, isPortOpen } from './test-util';
import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import * as logger from '../../../src/action/log';
import NavAction from '../../../src/action/nav';
import InfoAction from '../../../src/action/info';
import WalletAction from '../../../src/action/wallet';
import ChannelAction from '../../../src/action/channel';
import TransactionAction from '../../../src/action/transaction';
import PaymentAction from '../../../src/action/payment';
import { EventEmitter } from 'events';

const {
  startLndProcess,
  startBtcdProcess,
  mineBlocks,
} = require('../../../public/lnd-child-process');
const grcpClient = require('../../../public/grpc-client');

/* eslint-disable no-unused-vars */

const isDev = true;
const BTCD_PORT = 18556;
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
const seedPassphrase = 'hodlgang';
const walletPassword = 'bitconeeeeeect';

const wireUpIpc = (s1, s2) =>
  (s1.send = (msg, ...args) => s2.emit(msg, { sender: s2 }, ...args));

const ipcMainStub1 = new EventEmitter();
const ipcRendererStub1 = new EventEmitter();
wireUpIpc(ipcMainStub1, ipcRendererStub1);
wireUpIpc(ipcRendererStub1, ipcMainStub1);

const ipcMainStub2 = new EventEmitter();
const ipcRendererStub2 = new EventEmitter();
wireUpIpc(ipcMainStub2, ipcRendererStub2);
wireUpIpc(ipcRendererStub2, ipcMainStub2);

describe('Action Integration Tests', function() {
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
    store1 = new Store();
    store2 = new Store();

    btcdArgs = {
      isDev,
      logger,
      btcdLogDir: BTCD_LOG_DIR,
      btcdDataDir: BTCD_DATA_DIR,
    };
    btcdProcess = await startBtcdProcess(btcdArgs);
    await nap(NAP_TIME);
    await poll(() => isPortOpen(BTCD_PORT));
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

    await grcpClient.init({
      ipcMain: ipcMainStub1,
      lndPort: LND_PORT_1,
      lndDataDir: LND_DATA_DIR_1,
      macaroonsEnabled: MACAROONS_ENABLED,
    });
    await grcpClient.init({
      ipcMain: ipcMainStub2,
      lndPort: LND_PORT_2,
      lndDataDir: LND_DATA_DIR_2,
      macaroonsEnabled: MACAROONS_ENABLED,
    });

    navStub1 = sinon.createStubInstance(NavAction);
    grpc1 = new GrpcAction(store1, ipcRendererStub1);
    info1 = new InfoAction(store1, grpc1);
    wallet1 = new WalletAction(store1, grpc1, navStub1);
    channels1 = new ChannelAction(store1, grpc1);
    transactions1 = new TransactionAction(store1, grpc1);
    payments1 = new PaymentAction(store1, grpc1, wallet1);

    navStub2 = sinon.createStubInstance(NavAction);
    grpc2 = new GrpcAction(store2, ipcRendererStub2);
    info2 = new InfoAction(store2, grpc2);
    wallet2 = new WalletAction(store2, grpc2, navStub2);
    channels2 = new ChannelAction(store2, grpc2);
    transactions2 = new TransactionAction(store2, grpc2);
    payments2 = new PaymentAction(store2, grpc2, wallet2);
  });

  after(() => {
    lndProcess1.kill();
    lndProcess2.kill();
    btcdProcess.kill();
    sandbox.restore();
  });

  describe.skip('Generate seed and unlock wallet', () => {
    it('should wait for unlockerReady', async () => {
      await grpc1.initUnlocker();
      expect(store1.unlockerReady, 'to be true');
    });

    it('should generate new seed for node1', async () => {
      await wallet1.generateSeed({ seedPassphrase });
      expect(store1.seedMnemonic, 'to be ok');
    });

    it('should import existing seed for node1', async () => {
      await wallet1.initWallet({
        walletPassword,
        seedPassphrase,
        seedMnemonic: store1.seedMnemonic,
      });
      expect(store1.walletUnlocked, 'to be true');
    });

    it('should kill lnd node1', async () => {
      await nap(NAP_TIME);
      lndProcess1.kill();
      store1.unlockerReady = false;
      store1.walletUnlocked = false;
    });

    it('should start new lnd node1', async () => {
      lndProcess1 = await startLndProcess({
        isDev,
        macaroonsEnabled: MACAROONS_ENABLED,
        lndDataDir: LND_DATA_DIR_1,
        lndLogDir: LND_LOG_DIR_1,
        lndPort: LND_PORT_1,
        lndPeerPort: LND_PEER_PORT_1,
        lndRestPort: LND_REST_PORT_1,
        logger,
      });

      await grcpClient.init({
        ipcMain: ipcMainStub1,
        lndPort: LND_PORT_1,
        lndDataDir: LND_DATA_DIR_1,
        macaroonsEnabled: MACAROONS_ENABLED,
      });

      await grpc1.initUnlocker();
      while (!store1.unlockerReady) await nap(100);
    });

    it('should unlock wallet for node1', async () => {
      await wallet1.unlockWallet({ walletPassword });
      expect(store1.walletUnlocked, 'to be true');
    });

    it('should wait for lndReady', async () => {
      await grpc1.initLnd();
      expect(store1.lndReady, 'to be true');
    });

    it('should generate payment request', async () => {
      const invoice = await wallet1.generatePaymentRequest();
      expect(invoice, 'to be ok');
    });
  });

  describe('Wallet and Info actions', () => {
    it('should wait for lndReady', async () => {
      await grpc1.initLnd();
      expect(store1.lndReady, 'to be true');
      await grpc2.initLnd();
      expect(store2.lndReady, 'to be true');
    });

    it('should create new address for node1', async () => {
      await wallet1.getNewAddress();
      expect(store1.walletAddress, 'to be ok');
    });

    it('should fund wallet for node1', async () => {
      btcdProcess.kill();
      btcdArgs.miningAddress = store1.walletAddress;
      btcdProcess = await startBtcdProcess(btcdArgs);
      await nap(NAP_TIME);
      await poll(() => isPortOpen(BTCD_PORT));
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

    it('should list no transactions initially', async () => {
      await transactions2.getTransactions();
      expect(store2.transactions, 'to be empty');
      transactions2.subscribeTransactions();
    });

    it('should send some on-chain funds to node2', async () => {
      await payments1.sendCoins({
        address: store2.walletAddress,
        amount: 1000000000,
      });
    });

    it('should list transaction as confirmed after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (!store2.transactions.length) await nap(100);
      const tx = store2.computedTransactions.find(t => t.type === 'bitcoin');
      expect(tx.status, 'to be', 'confirmed');
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
      expect(store1.peers, 'to be empty');
    });

    it('should list no pending channels initially', async () => {
      await channels1.getPendingChannels();
      expect(store1.pendingChannels, 'to be empty');
    });

    it('should list no open channels initially', async () => {
      await channels1.getChannels();
      expect(store1.channels, 'to be empty');
    });

    it('should connect to peer', async () => {
      await channels1.connectToPeer({ host: HOST_2, pubkey: store2.pubKey });
      expect(store1.peers[0].pubKey, 'to be', store2.pubKey);
    });

    it('should list pending open channel after opening', async () => {
      channels1.openChannel({ pubkey: store2.pubKey, amount: 1000000 });
      while (!store1.pendingChannels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'pending-open');
    });

    it('should list open channel after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannels.length) await nap(100);
      while (!store1.channels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'open');
    });

    it('should have enough satoshis in channel balance', async () => {
      await updateBalances();
      expect(store1.channelBalanceSatoshis, 'to be positive');
      expect(store2.channelBalanceSatoshis, 'to be', 0);
    });

    it('should list no invoices initially', async () => {
      await transactions2.getInvoices();
      expect(store2.invoices, 'to be empty');
    });

    it('should generate payment request', async () => {
      payReq = await wallet2.generatePaymentRequest(100, 'coffee');
      expect(payReq, 'to match', /^lightning:/);
    });

    it('should list new invoice as in-progress', async () => {
      await transactions2.getInvoices();
      expect(store2.invoices[0].status, 'to be', 'in-progress');
      transactions2.subscribeInvoices();
    });

    it('should send lightning payment from request', async () => {
      await payments1.payLightning({ payment: payReq });
    });

    it('should update complete invoice via subscription', async () => {
      while (store2.invoices[0].status === 'in-progress') await nap(100);
      const tx = store2.computedTransactions.find(t => t.type === 'lightning');
      expect(tx.status, 'to be', 'complete');
    });

    it('should have satoshis in node2 channel balance after payment', async () => {
      await updateBalances();
      expect(store2.channelBalanceSatoshis, 'to be', 100);
    });

    it('should list pending-closing channel after closing', async () => {
      channels1.closeChannel({
        channelPoint: store1.computedChannels[0].channelPoint,
      });
      while (!store1.pendingChannels.length) await nap(100);
      while (store1.channels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'pending-closing');
    });

    it('should list no channels after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 0);
    });

    it('should list pending open channel after opening', async () => {
      channels1.openChannel({ pubkey: store2.pubKey, amount: 1000000 });
      while (!store1.pendingChannels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'pending-open');
    });

    it('should list open channel after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannels.length) await nap(100);
      while (!store1.channels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'open');
    });

    it('should list pending-force-closing after force closing', async () => {
      channels1.closeChannel({
        channelPoint: store1.channels[0].channelPoint,
        force: true,
      });
      while (!store1.pendingChannels.length) await nap(100);
      while (store1.channels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(
        store1.computedChannels[0].status,
        'to be',
        'pending-force-closing'
      );
    });

    it('should list no channels after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 0);
    });
  });

  const mineAndSync = async ({ blocks }) => {
    await mineBlocks({ blocks, logger });
    await info1.getInfo();
    await info2.getInfo();
  };

  const updateBalances = async () => {
    await wallet1.getBalance();
    await wallet1.getChannelBalance();
    await wallet2.getBalance();
    await wallet2.getChannelBalance();
  };
});
