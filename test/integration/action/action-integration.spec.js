import { rmdir, isPortOpen, killProcess } from './test-util';
import { Store } from '../../../src/store';
import IpcAction from '../../../src/action/ipc';
import GrpcAction from '../../../src/action/grpc';
import AppStorage from '../../../src/action/app-storage';
import NavAction from '../../../src/action/nav';
import * as logger from '../../../src/action/log';
import NotificationAction from '../../../src/action/notification';
import InfoAction from '../../../src/action/info';
import WalletAction from '../../../src/action/wallet';
import ChannelAction from '../../../src/action/channel';
import TransactionAction from '../../../src/action/transaction';
import PaymentAction from '../../../src/action/payment';
import InvoiceAction from '../../../src/action/invoice';
import AtplAction from '../../../src/action/autopilot';
import { nap, retry } from '../../../src/helper';
import { EventEmitter } from 'events';
import { BTCD_MINING_ADDRESS } from '../../../src/config';

const {
  startLndProcess,
  startBtcdProcess,
  mineBlocks,
} = require('../../../public/lnd-child-process');
const grcpClient = require('../../../public/grpc-client');

/* eslint-disable no-unused-vars */

const isDev = true;
const NETWORK = 'simnet';
const BTCD_PORT = 18555;
const BTCD_SETTINGS_DIR = 'test/data/btcd';
const LND_SETTINGS_DIR_1 = 'test/data/lnd_1';
const LND_SETTINGS_DIR_2 = 'test/data/lnd_2';
const LND_PORT_1 = 10001;
const LND_PORT_2 = 10002;
const LND_PEER_PORT_1 = 10011;
const LND_PEER_PORT_2 = 10012;
const LND_REST_PORT_1 = 8001;
const LND_REST_PORT_2 = 8002;
const HOST_1 = `localhost:${LND_PEER_PORT_1}`;
const HOST_2 = `localhost:${LND_PEER_PORT_2}`;
const NAP_TIME = process.env.NAP_TIME || 5000;
const walletPassword = 'bitconeeeeeect';
const newWalletPassword = 'wassupwassup';

const wireUpIpc = (s1, s2) => {
  s1.send = (msg, ...args) => {
    setTimeout(() => s2.emit(msg, { sender: s2 }, ...args), 1);
  };
};

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
  let db1;
  let db2;
  let sandbox;
  let lndProcess1;
  let lndProcess2;
  let btcdProcess;
  let nav1;
  let notify1;
  let ipc1;
  let grpc1;
  let info1;
  let wallet1;
  let channels1;
  let transactions1;
  let payments1;
  let invoice1;
  let autopilot1;
  let nav2;
  let notify2;
  let ipc2;
  let grpc2;
  let info2;
  let wallet2;
  let channels2;
  let transactions2;
  let payments2;
  let invoice2;
  let autopilot2;
  let btcdArgs;

  const startLnd = async () => {
    const lndProcess1Promise = startLndProcess({
      isDev,
      lndSettingsDir: LND_SETTINGS_DIR_1,
      lndPort: LND_PORT_1,
      lndPeerPort: LND_PEER_PORT_1,
      lndRestPort: LND_REST_PORT_1,
      logger,
    });
    const lndProcess2Promise = startLndProcess({
      isDev,
      lndSettingsDir: LND_SETTINGS_DIR_2,
      lndPort: LND_PORT_2,
      lndPeerPort: LND_PEER_PORT_2,
      lndRestPort: LND_REST_PORT_2,
      logger,
    });

    lndProcess1 = await lndProcess1Promise;
    lndProcess2 = await lndProcess2Promise;
    await nap(NAP_TIME);
  };

  before(async () => {
    rmdir('test/data');
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store1 = new Store();
    store2 = new Store();
    store1.settings.unit = 'btc';
    store2.settings.unit = 'btc';
    store1.settings.displayFiat = false;
    store2.settings.displayFiat = false;
    store1.init();
    store2.init();

    btcdArgs = {
      isDev,
      logger,
      btcdSettingsDir: BTCD_SETTINGS_DIR,
      miningAddress: BTCD_MINING_ADDRESS,
    };
    btcdProcess = await startBtcdProcess(btcdArgs);
    await nap(NAP_TIME);
    await retry(() => isPortOpen(BTCD_PORT));
    await mineBlocks({ blocks: 400, logger });

    await startLnd();

    await grcpClient.init({
      ipcMain: ipcMainStub1,
      lndPort: LND_PORT_1,
      lndSettingsDir: LND_SETTINGS_DIR_1,
      network: NETWORK,
    });
    await grcpClient.init({
      ipcMain: ipcMainStub2,
      lndPort: LND_PORT_2,
      lndSettingsDir: LND_SETTINGS_DIR_2,
      network: NETWORK,
    });

    db1 = sinon.createStubInstance(AppStorage);
    nav1 = sinon.createStubInstance(NavAction);
    notify1 = sinon.createStubInstance(NotificationAction, nav1);
    ipc1 = new IpcAction(ipcRendererStub1);
    grpc1 = new GrpcAction(store1, ipc1);
    info1 = new InfoAction(store1, grpc1, nav1, notify1);
    wallet1 = new WalletAction(store1, grpc1, db1, nav1, notify1);
    transactions1 = new TransactionAction(store1, grpc1, nav1, notify1);
    channels1 = new ChannelAction(store1, grpc1, nav1, notify1);
    invoice1 = new InvoiceAction(store1, grpc1, nav1, notify1);
    payments1 = new PaymentAction(store1, grpc1, nav1, notify1);
    autopilot1 = new AtplAction(store1, grpc1, db1, notify1);

    db2 = sinon.createStubInstance(AppStorage);
    nav2 = sinon.createStubInstance(NavAction);
    notify2 = sinon.createStubInstance(NotificationAction, nav2);
    ipc2 = new IpcAction(ipcRendererStub2);
    grpc2 = new GrpcAction(store2, ipc2);
    info2 = new InfoAction(store2, grpc2, nav2, notify2);
    wallet2 = new WalletAction(store2, grpc2, db2, nav2, notify2);
    transactions2 = new TransactionAction(store2, grpc2, nav2, notify2);
    channels2 = new ChannelAction(store2, grpc2, nav2, notify2);
    invoice2 = new InvoiceAction(store2, grpc2, nav2, notify2);
    payments2 = new PaymentAction(store2, grpc2, nav2, notify2);
    autopilot2 = new AtplAction(store2, grpc2, db2, notify2);

    sandbox.stub(autopilot1, 'updateNodeScores').resolves(true);
    sandbox.stub(autopilot2, 'updateNodeScores').resolves(true);
  });

  after(async () => {
    await Promise.all([grpc1.closeLnd(), grpc2.closeLnd()]);
    lndProcess1.kill('SIGINT');
    lndProcess2.kill('SIGINT');
    btcdProcess.kill('SIGINT');
  });

  describe('Generate seed and unlock wallet', () => {
    it('should wait for unlockerReady', async () => {
      await grpc1.initUnlocker();
      expect(store1.unlockerReady, 'to be true');
      await grpc2.initUnlocker();
      expect(store2.unlockerReady, 'to be true');
    });

    it('should generate new seed', async () => {
      await wallet1.generateSeed();
      expect(store1.seedMnemonic, 'to be ok');
      await wallet2.generateSeed();
      expect(store2.seedMnemonic, 'to be ok');
    });

    it('should import existing seed', async () => {
      await wallet1.initWallet({
        walletPassword,
        seedMnemonic: store1.seedMnemonic.toJSON(),
      });
      expect(store1.walletUnlocked, 'to be true');
      await wallet2.initWallet({
        walletPassword,
        seedMnemonic: store2.seedMnemonic.toJSON(),
      });
      expect(store2.walletUnlocked, 'to be true');
    });

    it('should close unlocker grpc clients', async () => {
      await nap(NAP_TIME);
      await grpc1.closeUnlocker();
      await grpc2.closeUnlocker();
    });
  });

  describe('Wallet and Info actions', () => {
    it('should wait for lndReady', async () => {
      await grpc1.initLnd();
      expect(store1.lndReady, 'to be true');
      await grpc2.initLnd();
      expect(store2.lndReady, 'to be true');
    });

    it('should reset password', async () => {
      lndProcess1.kill('SIGINT');
      lndProcess2.kill('SIGINT');
      await startLnd();
      ipcMainStub1.on('lnd-restart-process', async event => {
        event.sender.send('lnd-restart-error', { restartError: undefined });
      });
      store1.walletUnlocked = false;
      await wallet1.resetPassword({
        currentPassword: walletPassword,
        newPassword: newWalletPassword,
      });
      expect(store1.walletUnlocked, 'to be true');
      store2.walletUnlocked = false;
      ipcMainStub2.on('lnd-restart-process', event => {
        event.sender.send('lnd-restart-error', { restartError: undefined });
      });
      await wallet2.resetPassword({
        currentPassword: walletPassword,
        newPassword: newWalletPassword,
      });
      expect(store2.walletUnlocked, 'to be true');
    });

    it('should unlock wallet with reset password', async () => {
      lndProcess1.kill();
      lndProcess2.kill();
      await startLnd();

      store1.walletUnlocked = false;
      await grpc1.initUnlocker();
      await wallet1.unlockWallet({ walletPassword: newWalletPassword });
      expect(store1.walletUnlocked, 'to be true');

      store2.walletUnlocked = false;
      await grpc2.initUnlocker();
      await wallet2.unlockWallet({ walletPassword: newWalletPassword });
      expect(store2.walletUnlocked, 'to be true');
    });

    it('should close unlocker grpc clients and re-initialize lnd', async () => {
      await grpc1.closeUnlocker();
      await grpc1.initLnd();

      await grpc2.closeUnlocker();
      await grpc2.initLnd();
    });

    it('should create new address for node1', async () => {
      await wallet1.getNewAddress();
      expect(store1.walletAddress, 'to be ok');
    });

    it('should fund wallet for node1', async () => {
      await killProcess(btcdProcess.pid);
      btcdArgs.miningAddress = store1.walletAddress;
      btcdProcess = await startBtcdProcess(btcdArgs);
      await nap(NAP_TIME);
      await retry(() => isPortOpen(BTCD_PORT));
      await mineAndSync({ blocks: 100 });
    });

    it('should get public key node1', async () => {
      await info1.pollInfo();
      expect(store1.pubKey, 'to be ok');
      expect(store1.network, 'to equal', 'simnet');
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
      payments1.setAddress({ address: store2.walletAddress });
      payments1.setAmount({ amount: '10' });
      await payments1.estimateFee();
      expect(store1.payment.fee, 'to be ok');
      await payments1.payBitcoin();
    });

    it('should list transaction as confirmed after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (!store2.transactions.length) await nap(100);
      const tx = store2.computedTransactions.find(t => t.type === 'bitcoin');
      expect(tx.confirmations, 'to be positive');
    });

    it('should get public key node2', async () => {
      await info2.pollInfo();
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
      expect(store1.pendingBalanceSatoshis, 'to be', 0);
      expect(store2.pendingBalanceSatoshis, 'to be', 0);
    });
  });

  describe('Autopilot actions', () => {
    it('should wait for autopilotReady', async () => {
      await grpc1.initAutopilot();
      expect(store1.autopilotReady, 'to be true');
      await grpc2.initAutopilot();
      expect(store2.autopilotReady, 'to be true');
    });

    it('should init autopilot', async () => {
      await autopilot1.init();
      expect(store1.settings.autopilot, 'to be true');
      const status = await grpc1.sendAutopilotCommand('status');
      expect(status.active, 'to be true');
    });

    it('should be able to toggle autopilot', async () => {
      await autopilot1.toggle();
      expect(store1.settings.autopilot, 'to be false');
      let status = await grpc1.sendAutopilotCommand('status');
      expect(status.active, 'to be false');

      await autopilot1.toggle();
      expect(store1.settings.autopilot, 'to be true');
      status = await grpc1.sendAutopilotCommand('status');
      expect(status.active, 'to be true');
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

    it('should connect to peer and open channel', () => {
      channels1.setAmount({ amount: '0.01' });
      channels1.setPubkeyAtHost({ pubkeyAtHost: `${store2.pubKey}@${HOST_2}` });
      channels1.connectAndOpen();
    });

    it('should list pending open channel', async () => {
      while (!store1.pendingChannels.length) await nap(100);
      expect(store1.peers[0].pubKey, 'to be', store2.pubKey);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'pending-open');
    });

    it('should have enough satoshis in pending balance', async () => {
      await updateBalances();
      expect(store1.pendingBalanceSatoshis, 'to be positive');
      expect(store2.pendingBalanceSatoshis, 'to be', 0);
      expect(store1.channelBalanceSatoshis, 'to be', 0);
      expect(store2.channelBalanceSatoshis, 'to be', 0);
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
      expect(store1.pendingBalanceSatoshis, 'to be', 0);
      expect(store2.pendingBalanceSatoshis, 'to be', 0);
      expect(store1.channelBalanceSatoshis, 'to be positive');
      expect(store2.channelBalanceSatoshis, 'to be', 0);
    });

    it('should list no invoices initially', async () => {
      await transactions2.getInvoices();
      expect(store2.invoices, 'to be empty');
    });

    it('should generate payment request', async () => {
      invoice2.setAmount({ amount: '0.000001' });
      invoice2.setNote({ note: 'coffee' });
      await invoice2.generateUri();
      expect(store2.invoice.encoded, 'to match', /^ln[a-zA-Z0-9]*$/);
    });

    it('should list new invoice as in-progress', async () => {
      await transactions2.getInvoices();
      expect(store2.invoices[0].status, 'to be', 'in-progress');
      transactions2.subscribeInvoices();
    });

    it('should not decode invalid invoice and return false', async () => {
      const isValid = await payments1.decodeInvoice({
        invoice: 'invalid_payment_request',
      });
      expect(isValid, 'to be', false);
    });

    it('should decode invoice, set fee and return true', async () => {
      const isValid = await payments1.decodeInvoice({
        invoice: store2.invoice.encoded,
      });
      expect(isValid, 'to be', true);
      while (!store1.payment.fee) await nap(100);
      expect(
        parseFloat(store1.payment.fee),
        'to be greater than or equal to',
        0
      );
    });

    it('should send lightning payment from request', async () => {
      payments1.setAddress({ address: store2.invoice.uri });
      await payments1.payLightning();
    });

    it('should decode memo from sent payment', async () => {
      await transactions1.getPayments();
      const memo = await transactions1.decodeMemo({
        payReq: store1.payments[0].paymentRequest,
      });
      expect(memo, 'to equal', 'coffee');
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

    it('should list waiting-close channel after closing', async () => {
      channels1.select({ item: store1.computedChannels[0] });
      channels1.closeSelectedChannel();
      while (!store1.pendingChannels.length) await nap(100);
      while (store1.channels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'waiting-close');
    });

    it('should list closed after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (!store1.closedChannels.length) {
        await nap(100);
        channels1.update();
      }
      expect(store1.computedChannels.length, 'to be', 1);
      expect(store1.computedChannels[0].status, 'to be', 'closed');
    });

    it('should list pending open channel after opening', async () => {
      channels1.openChannel({ pubkey: store2.pubKey, amount: 1000000 });
      while (!store1.pendingChannels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 2);
      expect(store1.computedChannels[0].status, 'to be', 'pending-open');
    });

    it('should list open channel after mining 6 blocks', async () => {
      await mineAndSync({ blocks: 6 });
      while (store1.pendingChannels.length) await nap(100);
      while (!store1.channels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 2);
      expect(store1.computedChannels[0].status, 'to be', 'open');
      expect(store1.computedChannels[0].private, 'to be', true);
    });

    it('should list waiting-close after force closing', async () => {
      channels1.closeChannel({
        channelPoint: store1.channels[0].channelPoint,
        force: true,
      });
      while (!store1.pendingChannels.length) await nap(100);
      while (store1.channels.length) await nap(100);
      expect(store1.computedChannels.length, 'to be', 2);
      expect(store1.computedChannels[0].status, 'to be', 'waiting-close');
    });

    it('should list closed after mining more than 144 blocks', async () => {
      await mineAndSync({ blocks: 144 });
      while (store1.closedChannels.length < 2) {
        await nap(100);
        await mineAndSync({ blocks: 1 });
        channels1.update();
      }
      expect(store1.computedChannels.length, 'to be', 2);
      expect(store1.computedChannels[0].status, 'to be', 'closed');
    });
  });

  const mineAndSync = async ({ blocks }) => {
    await mineBlocks({ blocks, logger });
    await info1.pollInfo();
    await info2.pollInfo();
  };

  const updateBalances = async () => {
    await nap(NAP_TIME);
    await wallet1.getBalance();
    await wallet1.getChannelBalance();
    await wallet2.getBalance();
    await wallet2.getChannelBalance();
  };
});
