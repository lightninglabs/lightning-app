import { Store } from '../../../src/store';
import ActionsNav from '../../../src/actions/nav';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsWallet from '../../../src/actions/wallet';
import ActionsNotification from '../../../src/actions/notification';
import nock from 'nock';
import 'isomorphic-fetch';

describe('Actions Wallet Unit Tests', () => {
  let store;
  let actionsNav;
  let actionsGrpc;
  let actionsWallet;
  let actionsNotification;

  beforeEach(() => {
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    actionsNav = sinon.createStubInstance(ActionsNav);
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsNotification = sinon.createStubInstance(ActionsNotification);
    actionsWallet = new ActionsWallet(
      store,
      actionsGrpc,
      actionsNav,
      actionsNotification
    );
  });

  describe('generateSeed()', () => {
    it('should generate random seed words', async () => {
      actionsGrpc.sendUnlockerCommand.withArgs('GenSeed').resolves({
        cipher_seed_mnemonic: 'foo bar',
      });
      await actionsWallet.generateSeed({ seedPassphrase: 'baz' });
      expect(store.seedMnemonic, 'to equal', 'foo bar');
    });

    it('should display error notification on failure', async () => {
      actionsGrpc.sendUnlockerCommand
        .withArgs('GenSeed')
        .rejects(new Error('Boom!'));
      await actionsWallet.generateSeed({ seedPassphrase: 'baz' });
      expect(store.seedMnemonic, 'to be', null);
      expect(actionsNotification.display, 'was called once');
    });
  });

  describe('initWallet()', () => {
    it('should init wallet', async () => {
      actionsGrpc.sendUnlockerCommand.withArgs('InitWallet').resolves();
      await actionsWallet.initWallet({ seedPassphrase: 'baz' });
      expect(store.walletUnlocked, 'to be', true);
    });

    it('should display error notification on failure', async () => {
      actionsGrpc.sendUnlockerCommand
        .withArgs('InitWallet')
        .rejects(new Error('Boom!'));
      await actionsWallet.initWallet({ seedPassphrase: 'baz' });
      expect(actionsNotification.display, 'was called once');
    });
  });

  describe('unlockWallet()', () => {
    it('should unlock wallet', async () => {
      actionsGrpc.sendUnlockerCommand.withArgs('UnlockWallet').resolves();
      await actionsWallet.unlockWallet({ walletPassword: 'baz' });
      expect(store.walletUnlocked, 'to be', true);
    });

    it('should display error notification on failure', async () => {
      actionsGrpc.sendUnlockerCommand
        .withArgs('UnlockWallet')
        .rejects(new Error('Boom!'));
      await actionsWallet.unlockWallet({ seedPassphrase: 'baz' });
      expect(actionsNotification.display, 'was called once');
    });
  });

  describe('getBalance()', () => {
    it('should get wallet balance', async () => {
      actionsGrpc.sendCommand.withArgs('WalletBalance').resolves({
        total_balance: 1,
        confirmed_balance: 2,
        unconfirmed_balance: 3,
      });
      await actionsWallet.getBalance();
      expect(store.balanceSatoshis, 'to equal', 1);
      expect(store.confirmedBalanceSatoshis, 'to equal', 2);
      expect(store.unconfirmedBalanceSatoshis, 'to equal', 3);
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsWallet.getBalance();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getChannelBalance()', () => {
    it('should get channel balance', async () => {
      actionsGrpc.sendCommand
        .withArgs('ChannelBalance')
        .resolves({ balance: 1 });
      await actionsWallet.getChannelBalance();
      expect(store.channelBalanceSatoshis, 'to equal', 1);
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsWallet.getChannelBalance();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('generatePaymentRequest()', () => {
    it('should add invoice and return payment request', async () => {
      actionsGrpc.sendCommand.withArgs('addInvoice').resolves({
        payment_request: 'some-request',
      });
      const request = await actionsWallet.generatePaymentRequest(
        42,
        'some-note'
      );
      expect(request, 'to equal', 'lightning:some-request');
    });
  });

  describe('getNewAddress()', () => {
    it('should get new address', async () => {
      actionsGrpc.sendCommand.withArgs('NewAddress').resolves({
        address: 'some-address',
      });
      await actionsWallet.getNewAddress();
      expect(store.walletAddress, 'to equal', 'some-address');
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsWallet.getNewAddress();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getIPAddress()', () => {
    it('should return IP correctly', async () => {
      nock('https://api.ipify.org')
        .get('/')
        .query({ format: 'json' })
        .reply(200, { ip: '0.0.0.0' });
      await actionsWallet.getIPAddress();
      expect(store.ipAddress, 'to be', '0.0.0.0');
    });
  });
});
