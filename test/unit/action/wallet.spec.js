import { observable, useStrict } from 'mobx';
import GrpcAction from '../../../src/action/grpc';
import WalletAction from '../../../src/action/wallet';
import NavAction from '../../../src/action/nav';
import NotificationAction from '../../../src/action/notification';
import * as logger from '../../../src/action/log';
import nock from 'nock';
import 'isomorphic-fetch';

describe('Action Wallet Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let wallet;
  let nav;
  let notification;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    useStrict(false);
    store = observable({
      wallet: {
        password: '',
        passwordVerify: '',
        seedVerify: ['', '', ''],
      },
      seedMnemonic: [],
      settings: {
        unit: 'btc',
        fiat: 'usd',
        displayFiat: false,
        exchangeRate: {
          usd: null,
        },
      },
    });
    require('../../../src/config').RETRY_DELAY = 1;
    require('../../../src/config').NOTIFICATION_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    notification = sinon.createStubInstance(NotificationAction);
    nav = sinon.createStubInstance(NavAction);
    wallet = new WalletAction(store, grpc, nav, notification);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initSeedVerify()', () => {
    it('should clear attributes and navigate to view', () => {
      store.wallet.seedVerify = 'foo';
      wallet.initSeedVerify();
      expect(store.wallet.seedVerify[0], 'to equal', '');
      expect(store.wallet.seedVerify[1], 'to equal', '');
      expect(store.wallet.seedVerify[2], 'to equal', '');
      expect(nav.goSeedVerify, 'was called once');
    });
  });

  describe('setSeedVerify()', () => {
    it('should clear attributes', () => {
      wallet.setSeedVerify({ word: 'foo', index: 1 });
      expect(store.wallet.seedVerify[1], 'to equal', 'foo');
    });
  });

  describe('initSetPassword()', () => {
    it('should clear attributes and navigate to view', () => {
      store.wallet.password = 'foo';
      store.wallet.passwordVerify = 'bar';
      wallet.initSetPassword();
      expect(store.wallet.password, 'to equal', '');
      expect(store.wallet.passwordVerify, 'to equal', '');
      expect(nav.goSetPassword, 'was called once');
    });
  });

  describe('initPassword()', () => {
    it('should clear attributes and navigate to view', () => {
      store.wallet.password = 'foo';
      wallet.initPassword();
      expect(store.wallet.password, 'to equal', '');
      expect(nav.goPassword, 'was called once');
    });
  });

  describe('setPassword()', () => {
    it('should clear attributes', () => {
      wallet.setPassword({ password: 'foo' });
      expect(store.wallet.password, 'to equal', 'foo');
    });
  });

  describe('setPasswordVerify()', () => {
    it('should clear attributes', () => {
      wallet.setPasswordVerify({ password: 'foo' });
      expect(store.wallet.passwordVerify, 'to equal', 'foo');
    });
  });

  describe('init()', () => {
    it('should generate seed and navigate to onboarding', async () => {
      grpc.sendUnlockerCommand.withArgs('GenSeed').resolves({
        cipher_seed_mnemonic: 'foo bar',
      });
      await wallet.init();
      expect(store.seedMnemonic, 'to equal', 'foo bar');
      expect(nav.goLoader, 'was called once');
      expect(nav.goSeed, 'was called once');
    });

    it('should navigate to password unlock if wallet already exists', async () => {
      grpc.sendUnlockerCommand.withArgs('GenSeed').rejects(new Error('Boom!'));
      await wallet.init();
      expect(nav.goPassword, 'was called once');
    });
  });

  describe('update()', () => {
    it('should refresh balances, exchange rate and address', async () => {
      sandbox.stub(wallet, 'getExchangeRate');
      await wallet.update();
      expect(grpc.sendCommand, 'was called thrice');
      expect(wallet.getExchangeRate, 'was called once');
    });
  });

  describe('generateSeed()', () => {
    it('should generate seed', async () => {
      grpc.sendUnlockerCommand.withArgs('GenSeed').resolves({
        cipher_seed_mnemonic: 'foo bar',
      });
      await wallet.generateSeed();
      expect(store.seedMnemonic, 'to equal', 'foo bar');
    });

    it('should throw error up', async () => {
      grpc.sendUnlockerCommand.withArgs('GenSeed').rejects(new Error('Boom!'));
      await expect(
        wallet.generateSeed(),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });

  describe('checkSeed()', () => {
    beforeEach(() => {
      sandbox.stub(wallet, 'initSetPassword');
    });

    it('navigate to set password screen if input matches', async () => {
      store.seedMnemonic = ['foo', 'bar', 'baz'];
      store.seedVerifyIndexes = [1, 2, 3];
      wallet.setSeedVerify({ word: 'foo', index: 0 });
      wallet.setSeedVerify({ word: 'bar', index: 1 });
      wallet.setSeedVerify({ word: 'baz', index: 2 });
      await wallet.checkSeed();
      expect(wallet.initSetPassword, 'was called once');
    });

    it('display notification if input does not match', async () => {
      store.seedMnemonic = ['foo', 'bar', 'baz'];
      store.seedVerifyIndexes = [1, 2, 3];
      wallet.setSeedVerify({ word: 'foo', index: 0 });
      wallet.setSeedVerify({ word: 'bar', index: 1 });
      wallet.setSeedVerify({ word: 'ba', index: 2 });
      await wallet.checkSeed();
      expect(notification.display, 'was called once');
      expect(wallet.initSetPassword, 'was not called');
    });
  });

  describe('checkNewPassword()', () => {
    beforeEach(() => {
      sandbox.stub(wallet, 'initWallet');
      store.seedMnemonic[0] = 'foo';
      store.seedMnemonic[1] = 'bar';
      store.seedMnemonic[2] = 'baz';
    });

    it('init wallet if passwords match', async () => {
      wallet.setPassword({ password: 'secret123' });
      wallet.setPasswordVerify({ password: 'secret123' });
      await wallet.checkNewPassword();
      expect(wallet.initWallet, 'was called with', {
        walletPassword: 'secret123',
        seedMnemonic: ['foo', 'bar', 'baz'],
      });
    });

    it('display notification if input does not match', async () => {
      wallet.setPassword({ password: 'secret123' });
      wallet.setPasswordVerify({ password: 'secret1234' });
      await wallet.checkNewPassword();
      expect(wallet.initWallet, 'was not called');
      expect(notification.display, 'was called once');
    });

    it('display notification if password is too short', async () => {
      wallet.setPassword({ password: '' });
      wallet.setPasswordVerify({ password: '' });
      await wallet.checkNewPassword();
      expect(wallet.initWallet, 'was not called');
      expect(notification.display, 'was called once');
    });
  });

  describe('initWallet()', () => {
    it('should init wallet', async () => {
      grpc.sendUnlockerCommand.withArgs('InitWallet').resolves();
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(store.walletUnlocked, 'to be', true);
      expect(grpc.sendUnlockerCommand, 'was called with', 'InitWallet', {
        wallet_password: Buffer.from('baz', 'utf8'),
        cipher_seed_mnemonic: ['foo'],
      });
      expect(nav.goSeedSuccess, 'was called once');
    });

    it('should display error notification on failure', async () => {
      grpc.sendUnlockerCommand
        .withArgs('InitWallet')
        .rejects(new Error('Boom!'));
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(notification.display, 'was called once');
      expect(nav.goSeedSuccess, 'was not called');
    });
  });

  describe('checkPassword()', () => {
    beforeEach(() => {
      sandbox.stub(wallet, 'unlockWallet');
    });

    it('calls unlockWallet with password', async () => {
      wallet.setPassword({ password: 'secret123' });
      await wallet.checkPassword();
      expect(wallet.unlockWallet, 'was called with', {
        walletPassword: 'secret123',
      });
    });
  });

  describe('unlockWallet()', () => {
    it('should unlock wallet', async () => {
      grpc.sendUnlockerCommand.withArgs('UnlockWallet').resolves();
      await wallet.unlockWallet({ walletPassword: 'baz' });
      expect(store.walletUnlocked, 'to be', true);
      expect(grpc.sendUnlockerCommand, 'was called with', 'UnlockWallet', {
        wallet_password: Buffer.from('baz', 'utf8'),
      });
      expect(nav.goHome, 'was called once');
    });

    it('should display error notification on failure', async () => {
      grpc.sendUnlockerCommand
        .withArgs('UnlockWallet')
        .rejects(new Error('Boom!'));
      await wallet.unlockWallet({ walletPassword: 'baz' });
      expect(notification.display, 'was called once');
      expect(nav.goHome, 'was not called');
    });
  });

  describe('getBalance()', () => {
    it('should get wallet balance', async () => {
      grpc.sendCommand.withArgs('WalletBalance').resolves({
        total_balance: '1',
        confirmed_balance: '2',
        unconfirmed_balance: '3',
      });
      await wallet.getBalance();
      expect(store.balanceSatoshis, 'to equal', 1);
      expect(store.confirmedBalanceSatoshis, 'to equal', 2);
      expect(store.unconfirmedBalanceSatoshis, 'to equal', 3);
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await wallet.getBalance();
      expect(logger.error, 'was called once');
    });
  });

  describe('getChannelBalance()', () => {
    it('should get channel balance', async () => {
      grpc.sendCommand.withArgs('ChannelBalance').resolves({ balance: '1' });
      await wallet.getChannelBalance();
      expect(store.channelBalanceSatoshis, 'to equal', 1);
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await wallet.getChannelBalance();
      expect(logger.error, 'was called once');
    });
  });

  describe('getNewAddress()', () => {
    it('should get new address', async () => {
      grpc.sendCommand.withArgs('NewAddress').resolves({
        address: 'some-address',
      });
      await wallet.getNewAddress();
      expect(store.walletAddress, 'to equal', 'some-address');
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await wallet.getNewAddress();
      expect(logger.error, 'was called once');
    });
  });

  describe('getExchangeRate()', () => {
    it('should get exchange rate', async () => {
      nock('https://blockchain.info')
        .get('/tobtc')
        .query({ currency: 'usd', value: 1 })
        .reply(200, '0.00011536');
      await wallet.getExchangeRate();
      expect(store.settings.exchangeRate.usd, 'to be', 0.00011536);
    });

    it('should display notification on error', async () => {
      nock('https://blockchain.info')
        .get('/tobtc')
        .query({ currency: 'usd', value: 1 })
        .reply(500, 'Boom!');
      await wallet.getExchangeRate();
      expect(store.settings.exchangeRate.usd, 'to be', null);
      expect(logger.error, 'was called once');
    });
  });
});
