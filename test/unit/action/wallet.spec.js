import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import AppStorage from '../../../src/action/app-storage';
import WalletAction from '../../../src/action/wallet';
import BackupAction from '../../../src/action/backup-mobile';
import NavAction from '../../../src/action/nav';
import NavActionMobile from '../../../src/action/nav-mobile';
import FileAction from '../../../src/action/file-mobile';
import NotificationAction from '../../../src/action/notification';
import * as logger from '../../../src/action/log';
import nock from 'nock';
import 'isomorphic-fetch';
import { RECOVERY_WINDOW } from '../../../src/config';

describe('Action Wallet Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let db;
  let wallet;
  let nav;
  let notification;
  let file;
  let backup;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    require('../../../src/config').NOTIFICATION_DELAY = 1;
    require('../../../src/config').RATE_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    db = sinon.createStubInstance(AppStorage);
    notification = sinon.createStubInstance(NotificationAction);
    nav = sinon.createStubInstance(NavAction);
    file = sinon.createStubInstance(FileAction);
    backup = sinon.createStubInstance(BackupAction);
    wallet = new WalletAction(store, grpc, db, nav, notification, file, backup);
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
    it('should set seed word', () => {
      wallet.setSeedVerify({ word: 'foo', index: 1 });
      expect(store.wallet.seedVerify[1], 'to equal', 'foo');
    });

    it('should make seed word lowercase', () => {
      wallet.setSeedVerify({ word: 'FOO', index: 1 });
      expect(store.wallet.seedVerify[1], 'to equal', 'foo');
    });

    it('should trim whitespace', () => {
      wallet.setSeedVerify({ word: ' foo ', index: 1 });
      expect(store.wallet.seedVerify[1], 'to equal', 'foo');
    });
  });

  describe('initSetPassword()', () => {
    it('should clear attributes and navigate to view', () => {
      store.wallet.newPassword = 'foo';
      store.wallet.passwordVerify = 'bar';
      wallet.initSetPassword();
      expect(store.wallet.newPassword, 'to equal', '');
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

  describe('initResetPassword()', () => {
    it('should clear attributes and navigate to view', () => {
      store.wallet.password = 'foo';
      store.wallet.passwordVerify = 'bar';
      store.wallet.newPassword = 'baz';
      wallet.initResetPassword();
      expect(store.wallet.password, 'to equal', '');
      expect(store.wallet.passwordVerify, 'to equal', '');
      expect(store.wallet.newPassword, 'to equal', '');
      expect(nav.goResetPasswordCurrent, 'was called once');
    });
  });

  describe('setPassword()', () => {
    it('should clear attributes', () => {
      wallet.setPassword({ password: 'foo' });
      expect(store.wallet.password, 'to equal', 'foo');
    });
  });

  describe('setNewPassword()', () => {
    it('should clear attributes', () => {
      wallet.setNewPassword({ password: 'bar' });
      expect(store.wallet.newPassword, 'to equal', 'bar');
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
        cipherSeedMnemonic: 'foo bar',
      });
      await wallet.init();
      expect(store.firstStart, 'to be', true);
      expect(store.seedMnemonic, 'to equal', 'foo bar');
      expect(nav.goLoader, 'was called once');
      expect(nav.goSelectSeed, 'was called once');
    });

    it('should navigate to password unlock if wallet already exists', async () => {
      grpc.sendUnlockerCommand.withArgs('GenSeed').rejects(new Error('Boom!'));
      await wallet.init();
      expect(store.firstStart, 'to be', false);
      expect(nav.goPassword, 'was called once');
    });
  });

  describe('update()', () => {
    it('should refresh wallet balances', async () => {
      sandbox.stub(wallet, 'pollExchangeRate');
      await wallet.update();
      expect(grpc.sendCommand, 'was called thrice');
      expect(wallet.pollExchangeRate, 'was not called');
    });
  });

  describe('pollBalances()', () => {
    it('should poll wallet balances', async () => {
      sandbox.stub(wallet, 'update');
      wallet.update.onSecondCall().resolves(true);
      await wallet.pollBalances();
      expect(wallet.update, 'was called twice');
    });
  });

  describe('generateSeed()', () => {
    it('should generate seed', async () => {
      grpc.sendUnlockerCommand.withArgs('GenSeed').resolves({
        cipherSeedMnemonic: 'foo bar',
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
      sandbox.stub(wallet, 'initSetPassword');
      store.seedMnemonic[0] = 'foo';
      store.seedMnemonic[1] = 'bar';
      store.seedMnemonic[2] = 'baz';
    });

    it('init wallet if passwords match', async () => {
      wallet.setNewPassword({ password: 'secret123' });
      wallet.setPasswordVerify({ password: 'secret123' });
      await wallet.checkNewPassword();
      expect(wallet.initWallet, 'was called with', {
        walletPassword: 'secret123',
        seedMnemonic: ['foo', 'bar', 'baz'],
        recoveryWindow: 0,
      });
    });

    it('display notification if input does not match', async () => {
      wallet.setNewPassword({ password: 'secret123' });
      wallet.setPasswordVerify({ password: 'secret1234' });
      await wallet.checkNewPassword();
      expect(wallet.initWallet, 'was not called');
      expect(wallet.initSetPassword, 'was called once');
      expect(notification.display, 'was called once');
    });

    it('display notification if password is too short', async () => {
      wallet.setNewPassword({ password: 'secret' });
      wallet.setPasswordVerify({ password: 'secret' });
      await wallet.checkNewPassword();
      expect(wallet.initWallet, 'was not called');
      expect(wallet.initSetPassword, 'was called once');
      expect(notification.display, 'was called once');
    });

    it('init wallet correctly during restore', async () => {
      const restoreSeed = ['hi', 'hello', 'hola'];
      store.restoreSeedMnemonic = restoreSeed;
      store.settings.restoring = true;
      wallet.setNewPassword({ password: 'secret123' });
      wallet.setPasswordVerify({ password: 'secret123' });
      await wallet.checkNewPassword();
      expect(wallet.initWallet, 'was called with', {
        walletPassword: 'secret123',
        seedMnemonic: restoreSeed,
        recoveryWindow: RECOVERY_WINDOW,
      });
    });
  });

  describe('checkResetPassword()', () => {
    beforeEach(() => {
      store.wallet.password = 'secret123';
      sandbox.stub(wallet, 'resetPassword');
    });

    it('reset password if passwords match', async () => {
      wallet.setNewPassword({ password: 'newsecret123' });
      wallet.setPasswordVerify({ password: 'newsecret123' });
      await wallet.checkResetPassword();
      expect(wallet.resetPassword, 'was called with', {
        currentPassword: 'secret123',
        newPassword: 'newsecret123',
      });
    });

    it('fail if password is too short', async () => {
      wallet.setNewPassword({ password: '' });
      wallet.setPasswordVerify({ password: '' });
      await wallet.checkResetPassword();
      expect(wallet.resetPassword, 'was not called');
      expect(notification.display, 'was called once');
      expect(nav.goResetPasswordCurrent, 'was called once');
    });

    it('fail if input does not match', async () => {
      wallet.setNewPassword({ password: 'secret123' });
      wallet.setPasswordVerify({ password: 'secret123' });
      await wallet.checkResetPassword();
      expect(wallet.resetPassword, 'was not called');
      expect(notification.display, 'was called once');
      expect(nav.goResetPasswordCurrent, 'was called once');
    });

    it('fail if input does not match', async () => {
      wallet.setNewPassword({ password: 'resetsecret1' });
      wallet.setPasswordVerify({ password: 'resetsecret2' });
      await wallet.checkResetPassword();
      expect(wallet.resetPassword, 'was not called');
      expect(notification.display, 'was called once');
      expect(nav.goResetPasswordCurrent, 'was called once');
    });
  });

  describe('initWallet()', () => {
    it('should init wallet', async () => {
      grpc.sendUnlockerCommand.withArgs('InitWallet').resolves();
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(file.deleteWalletDB, 'was called with', 'mainnet');
      expect(file.deleteWalletDB, 'was called with', 'testnet');
      expect(store.walletUnlocked, 'to be', true);
      expect(grpc.sendUnlockerCommand, 'was called with', 'InitWallet', {
        walletPassword: Buffer.from('baz', 'utf8'),
        cipherSeedMnemonic: ['foo'],
      });
      expect(nav.goSeedSuccess, 'was called once');
      expect(backup.fetchChannelBackup, 'was not called');
    });

    it('should not delete wallet if RNFS not supported', async () => {
      grpc.sendUnlockerCommand.withArgs('InitWallet').resolves();
      delete wallet._file;
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(file.deleteWalletDB, 'was not called');
      expect(store.walletUnlocked, 'to be', true);
      expect(grpc.sendUnlockerCommand, 'was called with', 'InitWallet', {
        walletPassword: Buffer.from('baz', 'utf8'),
        cipherSeedMnemonic: ['foo'],
      });
      expect(nav.goSeedSuccess, 'was called once');
      expect(backup.fetchChannelBackup, 'was not called');
    });

    it('should not restore backup if not supported', async () => {
      store.settings.restoring = true;
      delete wallet._backup;
      grpc.sendUnlockerCommand.withArgs('InitWallet').resolves();
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(store.walletUnlocked, 'to be', true);
      expect(grpc.sendUnlockerCommand, 'was called with', 'InitWallet', {
        walletPassword: Buffer.from('baz', 'utf8'),
        cipherSeedMnemonic: ['foo'],
      });
      expect(nav.goSeedSuccess, 'was called once');
      expect(backup.fetchChannelBackup, 'was not called');
    });

    it('should restore backup if supported and in restore mode', async () => {
      backup.fetchChannelBackup.resolves('some-backup');
      store.settings.restoring = true;
      grpc.sendUnlockerCommand.withArgs('InitWallet').resolves();
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(store.walletUnlocked, 'to be', true);
      expect(grpc.sendUnlockerCommand, 'was called with', 'InitWallet', {
        walletPassword: Buffer.from('baz', 'utf8'),
        cipherSeedMnemonic: ['foo'],
        channelBackups: {
          multiChanBackup: {
            multiChanBackup: 'some-backup',
          },
        },
      });
      expect(nav.goSeedSuccess, 'was called once');
      expect(backup.fetchChannelBackup, 'was called once');
    });

    it('should handle empty backup if supported and in restore mode', async () => {
      backup.fetchChannelBackup.resolves(null);
      store.settings.restoring = true;
      grpc.sendUnlockerCommand.withArgs('InitWallet').resolves();
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(store.walletUnlocked, 'to be', true);
      expect(grpc.sendUnlockerCommand, 'was called with', 'InitWallet', {
        walletPassword: Buffer.from('baz', 'utf8'),
        cipherSeedMnemonic: ['foo'],
        channelBackups: undefined,
      });
      expect(nav.goSeedSuccess, 'was called once');
      expect(backup.fetchChannelBackup, 'was called once');
    });

    it('should display error notification on restore failure', async () => {
      store.settings.restoring = true;
      grpc.sendUnlockerCommand
        .withArgs('InitWallet')
        .rejects(new Error('Boom!'));
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(notification.display, 'was called once');
      expect(nav.goRestoreSeed, 'was called once');
      expect(nav.goSeedSuccess, 'was not called');
    });

    it('should display error notification on failure', async () => {
      grpc.sendUnlockerCommand
        .withArgs('InitWallet')
        .rejects(new Error('Boom!'));
      await wallet.initWallet({ walletPassword: 'baz', seedMnemonic: ['foo'] });
      expect(notification.display, 'was called once');
      expect(nav.goRestoreSeed, 'was not called');
      expect(nav.goSeedSuccess, 'was not called');
    });
  });

  describe('initSeed()', () => {
    it('should clear attributes and navigate to view', () => {
      store.wallet.seedIndex = 42;
      wallet.initSeed();
      expect(store.wallet.seedIndex, 'to equal', 0);
      expect(nav.goSeed, 'was called once');
    });

    it('should navigate to seed intro on mobile', () => {
      nav = sinon.createStubInstance(NavActionMobile);
      wallet = new WalletAction(store, grpc, db, nav, notification);
      wallet.initSeed();
      expect(nav.goSeedIntro, 'was called once');
    });
  });

  describe('initPrevSeedPage()', () => {
    it('should navigate to select seed if seedIndex < 8', () => {
      store.wallet.seedIndex = 7;
      wallet.initPrevSeedPage();
      expect(nav.goSelectSeed, 'was called once');
      expect(store.wallet.seedIndex, 'to equal', 7);
    });

    it('should decrement seedIndex if greater than 7', () => {
      store.wallet.seedIndex = 8;
      wallet.initPrevSeedPage();
      expect(nav.goSelectSeed, 'was not called');
      expect(store.wallet.seedIndex, 'to equal', 0);
    });
  });

  describe('initNextSeedPage()', () => {
    it('should init seed verify if seedIndex > 16', () => {
      store.wallet.seedIndex = 16;
      wallet.initNextSeedPage();
      expect(nav.goSeedVerify, 'was called');
      expect(store.wallet.seedIndex, 'to equal', 16);
    });

    it('should increment seedIndex if less than 16', () => {
      store.wallet.seedIndex = 8;
      wallet.initNextSeedPage();
      expect(nav.goSeedVerify, 'was not called');
      expect(store.wallet.seedIndex, 'to equal', 16);
    });
  });

  describe('initRestoreWallet()', () => {
    it('should clear attributes and navigate to view', () => {
      store.wallet.restoreIndex = 42;
      wallet.initRestoreWallet();
      expect(store.restoreSeedMnemonic.length, 'to equal', 24);
      expect(store.wallet.restoreIndex, 'to equal', 0);
      expect(nav.goRestoreSeed, 'was called once');
    });
  });

  describe('setRestoreSeed()', () => {
    beforeEach(() => {
      store.restoreSeedMnemonic = Array(24).fill('');
    });

    it('should clear attributes', () => {
      wallet.setRestoreSeed({ word: 'foo', index: 1 });
      expect(store.restoreSeedMnemonic[1], 'to equal', 'foo');
    });

    it('should trim whitespace', () => {
      wallet.setRestoreSeed({ word: ' foo ', index: 1 });
      expect(store.restoreSeedMnemonic[1], 'to equal', 'foo');
    });
  });

  describe('setFocusedRestoreInd()', () => {
    it('should set the currently focused restore seed index', () => {
      wallet.setFocusedRestoreInd({ index: 5 });
      expect(store.wallet.focusedRestoreInd, 'to equal', 5);
    });
  });

  describe('initPrevRestorePage()', () => {
    it('should navigate to select seed if restoreIndex < 3', () => {
      store.wallet.restoreIndex = 2;
      wallet.initPrevRestorePage();
      expect(nav.goSelectSeed, 'was called once');
      expect(store.wallet.restoreIndex, 'to equal', 2);
    });

    it('should decrement restoreIndex if greater than 2', async () => {
      store.wallet.restoreIndex = 3;
      store.wallet.focusedRestoreInd = 5;
      wallet.initPrevRestorePage();
      expect(nav.goSelectSeed, 'was not called');
      expect(store.wallet.restoreIndex, 'to equal', 0);
      expect(store.wallet.focusedRestoreInd, 'to equal', 0);
    });
  });

  describe('initNextRestorePage()', () => {
    it('should navigate to password screen if restoreIndex > 20', () => {
      store.wallet.restoreIndex = 21;
      wallet.initNextRestorePage();
      expect(nav.goSetPassword, 'was called once');
      expect(store.wallet.restoreIndex, 'to equal', 21);
    });

    it('should increment restoreIndex if less than 21', async () => {
      store.wallet.restoreIndex = 18;
      store.wallet.focusedRestoreInd = 19;
      wallet.initNextRestorePage();
      expect(nav.goSetPassword, 'was not called');
      expect(store.wallet.restoreIndex, 'to equal', 21);
      expect(store.wallet.focusedRestoreInd, 'to equal', 21);
    });
  });

  describe('initInitialDeposit()', () => {
    it('should navigate to new address screen if address is non-null', () => {
      store.walletAddress = 'non-null-addr';
      wallet.initInitialDeposit();
      expect(nav.goNewAddress, 'was called once');
      expect(nav.goWait, 'was not called');
    });

    it('should stay on wait screen until address is non-null', async () => {
      store.walletAddress = null;
      wallet.initInitialDeposit();
      expect(nav.goNewAddress, 'was not called');
      store.walletAddress = 'non-null-addr';
      expect(nav.goWait, 'was called once');
      expect(nav.goNewAddress, 'was called once');
    });
  });

  describe('resetPassword()', () => {
    it('should change password', async () => {
      grpc.restartLnd.resolves(true);
      grpc.sendUnlockerCommand.withArgs('ChangePassword').resolves();
      await wallet.resetPassword({
        currentPassword: 'currentPass',
        newPassword: 'newPass',
      });
      expect(grpc.sendUnlockerCommand, 'was called with', 'ChangePassword', {
        currentPassword: Buffer.from('currentPass', 'utf8'),
        newPassword: Buffer.from('newPass', 'utf8'),
      });
      expect(nav.goResetPasswordSaved, 'was called once');
    });

    it('should display error notification on lnd restart failure', async () => {
      grpc.restartLnd.rejects(new Error('Boom!'));
      await wallet.resetPassword({
        currentPassword: 'currentPass',
        newPassword: 'newPass',
      });
      expect(notification.display, 'was called once');
      expect(nav.goResetPasswordSaved, 'was not called');
    });

    it('should display error notification on failure', async () => {
      grpc.sendUnlockerCommand
        .withArgs('ChangePassword')
        .rejects(new Error('Boom!'));
      await wallet.resetPassword({
        currentPassword: 'currentPass',
        newPassword: 'newPass',
      });
      expect(notification.display, 'was called once');
      expect(nav.goResetPasswordSaved, 'was not called');
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
        walletPassword: Buffer.from('baz', 'utf8'),
      });
      expect(nav.goWait, 'was called once');
      expect(nav.goHome, 'was not called');
      store.lndReady = true;
      store.walletAddress = 'some-address';
      expect(nav.goHome, 'was called once');
    });

    it('should display error notification on failure and clear password', async () => {
      wallet.setPassword('not-empty');
      expect(store.wallet.password, 'not to be', '');
      grpc.sendUnlockerCommand
        .withArgs('UnlockWallet')
        .rejects(new Error('Boom!'));
      await wallet.unlockWallet({ walletPassword: 'baz' });
      expect(notification.display, 'was called once');
      expect(nav.goWait, 'was called once');
      expect(store.walletUnlocked, 'to be', false);
      expect(store.wallet.password, 'to be', '');
      expect(nav.goPassword, 'was called once');
    });
  });

  describe('toggleDisplayFiat()', () => {
    it('shoult not display fiat and save settings', async () => {
      store.settings.displayFiat = true;
      await wallet.toggleDisplayFiat();
      expect(store.settings.displayFiat, 'to be', false);
      expect(db.save, 'was called once');
    });

    it('should display fiat and save settings', async () => {
      store.settings.displayFiat = false;
      await wallet.toggleDisplayFiat();
      expect(store.settings.displayFiat, 'to be', true);
      expect(db.save, 'was called once');
    });
  });

  describe('getBalance()', () => {
    it('should get wallet balance', async () => {
      grpc.sendCommand.withArgs('WalletBalance').resolves({
        totalBalance: 1,
        confirmedBalance: 2,
        unconfirmedBalance: 3,
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
      grpc.sendCommand.withArgs('ChannelBalance').resolves({
        balance: 1,
        pendingOpenBalance: 2,
      });
      await wallet.getChannelBalance();
      expect(store.channelBalanceSatoshis, 'to equal', 1);
      expect(store.pendingBalanceSatoshis, 'to equal', 2);
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

  describe('pollExchangeRate()', () => {
    it('should poll getExchangeRate', async () => {
      sandbox.stub(wallet, 'getExchangeRate');
      wallet.getExchangeRate.onSecondCall().resolves(true);
      await wallet.pollExchangeRate();
      expect(wallet.getExchangeRate, 'was called twice');
    });
  });

  describe('getExchangeRate()', () => {
    const json = `{
      "tickers": [
        {
          "date": "2019-04-04T03:30:05.000Z",
          "rate": 443302,
          "ticker": "EUR"
        },
        {
          "date": "2019-04-04T03:30:05.000Z",
          "rate": 378294,
          "ticker": "GBP"
        },
        {
          "date": "2019-04-04T03:30:05.000Z",
          "rate": 498467,
          "ticker": "USD"
        }
      ]
    }`;

    it('should get exchange rate', async () => {
      nock('https://nodes.lightning.computer')
        .get('/fiat/v1/btc-exchange-rates.json')
        .reply(200, json);
      await wallet.getExchangeRate();
      expect(store.settings.exchangeRate.usd, 'to be', 0.000200615085853226);
      expect(db.save, 'was called once');
    });

    it('should display notification on error', async () => {
      nock('https://nodes.lightning.computer')
        .get('/fiat/v1/btc-exchange-rates.json')
        .reply(500, 'Boom!');
      await wallet.getExchangeRate();
      expect(store.settings.exchangeRate.usd, 'to be', undefined);
      expect(logger.error, 'was called once');
      expect(db.save, 'was not called');
    });
  });
});
