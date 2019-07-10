import { Store } from '../../../src/store';
import NavAction from '../../../src/action/nav-mobile';
import WalletAction from '../../../src/action/wallet';
import AuthAction from '../../../src/action/auth-mobile';

describe('Action AuthMobile Unit Tests', () => {
  let sandbox;
  let store;
  let wallet;
  let nav;
  let auth;
  let Random;
  let Keychain;
  let Fingerprint;
  let Alert;
  let ActionSheetIOS;
  let Platform;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    store = new Store();
    wallet = sinon.createStubInstance(WalletAction);
    nav = sinon.createStubInstance(NavAction);
    Random = {
      getRandomBytesAsync: sinon.stub(),
    };
    Keychain = {
      getInternetCredentials: sinon.stub(),
      setInternetCredentials: sinon.stub(),
    };
    Fingerprint = {
      hasHardwareAsync: sinon.stub(),
      isEnrolledAsync: sinon.stub(),
      authenticateAsync: sinon.stub(),
    };
    Alert = {
      alert: sinon.stub(),
    };
    ActionSheetIOS = {
      showActionSheetWithOptions: sinon.stub(),
    };
    Platform = { OS: 'ios' };
    auth = new AuthAction(
      store,
      wallet,
      nav,
      Random,
      Keychain,
      Fingerprint,
      Alert,
      ActionSheetIOS,
      Platform
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initSetPin()', () => {
    it('should init values and navigate', () => {
      auth.initSetPin();
      expect(store.auth.newPin, 'to equal', '');
      expect(store.auth.pinVerify, 'to equal', '');
      expect(nav.goSetPassword, 'was called once');
    });
  });

  describe('initPin()', () => {
    it('should init values and navigate', () => {
      auth.initPin();
      expect(store.auth.pin, 'to equal', '');
      expect(nav.goPassword, 'was called once');
    });
  });

  describe('initResetPin()', () => {
    it('should init values and navigate', () => {
      auth.initResetPin();
      expect(store.auth.resetPinCurrent, 'to equal', '');
      expect(store.auth.resetPinNew, 'to equal', '');
      expect(store.auth.resetPinVerify, 'to equal', '');
      expect(nav.goResetPasswordCurrent, 'was called once');
    });
  });

  describe('initResetPinNew()', () => {
    it('should init values and navigate', () => {
      store.auth.resetPinCurrent = '123456';
      auth.initResetPinNew();
      expect(store.auth.resetPinCurrent, 'to equal', '123456');
      expect(store.auth.resetPinNew, 'to equal', '');
      expect(store.auth.resetPinVerify, 'to equal', '');
      expect(nav.goResetPasswordNew, 'was called once');
    });
  });

  describe('pushPinDigit()', () => {
    beforeEach(() => {
      sandbox.stub(auth, 'checkResetPin');
    });

    it('should add a digit for empty pin', () => {
      auth.pushPinDigit({ digit: '1', param: 'pin' });
      expect(store.auth.pin, 'to equal', '1');
    });

    it('should add no digit for max length pin', () => {
      store.auth.pin = '000000';
      auth.pushPinDigit({ digit: '1', param: 'pin' });
      expect(store.auth.pin, 'to equal', '000000');
    });

    it('should go to next screen on last digit', () => {
      store.auth.newPin = '00000';
      auth.pushPinDigit({ digit: '1', param: 'newPin' });
      expect(store.auth.newPin, 'to equal', '000001');
      expect(nav.goSetPasswordConfirm, 'was called once');
    });

    it('should not go to next screen on fifth digit', () => {
      store.auth.newPin = '0000';
      auth.pushPinDigit({ digit: '1', param: 'newPin' });
      expect(store.auth.newPin, 'to equal', '00001');
      expect(nav.goSetPasswordConfirm, 'was not called');
    });

    it('should go to ResetPinNew if done with ResetPinCurrent', () => {
      store.auth.resetPinCurrent = '00000';
      auth.pushPinDigit({ digit: '1', param: 'resetPinCurrent' });
      expect(nav.goResetPasswordNew, 'was called once');
    });

    it('should go to ResetPinConfirm if done with ResetPinNew', () => {
      store.auth.resetPinNew = '00000';
      auth.pushPinDigit({ digit: '1', param: 'resetPinNew' });
      expect(nav.goResetPasswordConfirm, 'was called once');
    });

    it('should call auth.checkResetPin if done with resetPinVerify', () => {
      store.auth.resetPinVerify = '00000';
      auth.pushPinDigit({ digit: '1', param: 'resetPinVerify' });
      expect(auth.checkResetPin, 'was called once');
    });
  });

  describe('popPinDigit()', () => {
    beforeEach(() => {
      sandbox.stub(auth, 'initResetPinNew');
      sandbox.stub(auth, 'initResetPin');
    });

    it('should remove digit from a pin', () => {
      store.auth.pin = '000000';
      auth.popPinDigit({ param: 'pin' });
      expect(store.auth.pin, 'to equal', '00000');
    });

    it('should not remove a digit from an empty pin', () => {
      store.auth.pin = '';
      auth.popPinDigit({ param: 'pin' });
      expect(store.auth.pin, 'to equal', '');
    });

    it('should go back to SetPassword screen on empty string', () => {
      store.auth.pinVerify = '';
      auth.popPinDigit({ param: 'pinVerify' });
      expect(nav.goSetPassword, 'was called once');
    });

    it('should go from ResetPinCurrent to Settings on empty string', () => {
      store.auth.resetPinCurrent = '';
      auth.popPinDigit({ param: 'resetPinCurrent' });
      expect(nav.goSettings, 'was called once');
    });

    it('should go from ResetPinConfirmed to ResetPinNew on empty string', () => {
      store.auth.resetPinVerify = '';
      auth.popPinDigit({ param: 'resetPinVerify' });
      expect(auth.initResetPinNew, 'was called once');
    });

    it('should go from ResetPinNew to ResetPinCurrent on empty string', () => {
      store.auth.resetPinNew = '';
      auth.popPinDigit({ param: 'resetPinNew' });
      expect(auth.initResetPin, 'was called once');
    });
  });

  describe('checkNewPin()', () => {
    beforeEach(() => {
      sandbox.stub(auth, '_generateWalletPassword');
    });

    it('should work for two same pins', async () => {
      store.auth.newPin = '000000';
      store.auth.pinVerify = '000000';
      await auth.checkNewPin();
      expect(
        Keychain.setInternetCredentials,
        'was called with',
        '0_DevicePin',
        'lightning',
        '000000'
      );
      expect(auth._generateWalletPassword, 'was called once');
    });

    it('should display error for too short pins', async () => {
      store.auth.newPin = '00000';
      store.auth.pinVerify = '00000';
      await auth.checkNewPin();
      expect(Alert.alert, 'was called once');
      expect(Keychain.setInternetCredentials, 'was not called');
      expect(auth._generateWalletPassword, 'was not called');
    });

    it('should display error for non matching pins', async () => {
      store.auth.newPin = '000000';
      store.auth.pinVerify = '000001';
      await auth.checkNewPin();
      expect(Alert.alert, 'was called once');
      expect(Keychain.setInternetCredentials, 'was not called');
      expect(auth._generateWalletPassword, 'was not called');
    });
  });

  describe('checkPin()', () => {
    beforeEach(() => {
      sandbox.stub(auth, '_unlockWallet');
    });

    it('should work for two same pins', async () => {
      store.auth.pin = '000000';
      Keychain.getInternetCredentials.resolves({ password: '000000' });
      await auth.checkPin();
      expect(auth._unlockWallet, 'was called once');
    });

    it('should display error for non matching pins', async () => {
      store.auth.pin = '000001';
      Keychain.getInternetCredentials.resolves({ password: '000000' });
      await auth.checkPin();
      expect(Alert.alert, 'was called once');
      expect(auth._unlockWallet, 'was not called');
    });
  });

  describe('checkResetPin()', () => {
    beforeEach(() => {
      Keychain.getInternetCredentials.resolves({ password: '000000' });
    });

    it('should work for two same pins', async () => {
      store.auth.resetPinCurrent = '000000';
      store.auth.resetPinNew = '100000';
      store.auth.resetPinVerify = '100000';
      await auth.checkResetPin();
      expect(
        Keychain.setInternetCredentials,
        'was called with',
        '0_DevicePin',
        'lightning',
        '100000'
      );
      expect(nav.goResetPasswordSaved, 'was called once');
    });

    it('should display error for too short pins', async () => {
      store.auth.resetPinCurrent = '000000';
      store.auth.resetPinNew = '00000';
      store.auth.resetPinVerify = '00000';
      await auth.checkNewPin();
      expect(Alert.alert, 'was called once');
      expect(Keychain.setInternetCredentials, 'was not called');
      expect(nav.goResetPasswordSaved, 'was not called');
    });

    it('should display error for non matching pins', async () => {
      store.auth.resetPinCurrent = '000000';
      store.auth.resetPinNew = '000002';
      store.auth.resetPinVerify = '000001';
      await auth.checkResetPin();
      expect(Alert.alert, 'was called once');
      expect(Keychain.setInternetCredentials, 'was not called');
      expect(nav.goResetPasswordSaved, 'was not called');
    });

    it('should display error for non matching current pin', async () => {
      store.auth.resetPinCurrent = '200000';
      store.auth.resetPinNew = '000001';
      store.auth.resetPinVerify = '000001';
      await auth.checkResetPin();
      expect(Alert.alert, 'was called once');
      expect(Keychain.setInternetCredentials, 'was not called');
      expect(nav.goResetPasswordSaved, 'was not called');
    });
  });

  describe('tryFingerprint()', () => {
    beforeEach(() => {
      sandbox.stub(auth, '_unlockWallet');
    });

    it('should not unlock wallet without hardware support', async () => {
      Fingerprint.hasHardwareAsync.resolves(false);
      Fingerprint.isEnrolledAsync.resolves(true);
      await auth.tryFingerprint();
      expect(auth._unlockWallet, 'was not called');
    });

    it('should not unlock wallet if hardware not enrolled', async () => {
      Fingerprint.hasHardwareAsync.resolves(true);
      Fingerprint.isEnrolledAsync.resolves(false);
      await auth.tryFingerprint();
      expect(auth._unlockWallet, 'was not called');
    });

    it('should not unlock wallet if authentication failed', async () => {
      Fingerprint.hasHardwareAsync.resolves(true);
      Fingerprint.isEnrolledAsync.resolves(true);
      Fingerprint.authenticateAsync.resolves({ success: false });
      await auth.tryFingerprint();
      expect(auth._unlockWallet, 'was not called');
    });

    it('should unlock wallet if authentication worked', async () => {
      Fingerprint.hasHardwareAsync.resolves(true);
      Fingerprint.isEnrolledAsync.resolves(true);
      Fingerprint.authenticateAsync.resolves({ success: true });
      await auth.tryFingerprint();
      expect(auth._unlockWallet, 'was called once');
    });
  });

  describe('_generateWalletPassword()', () => {
    beforeEach(() => {
      const pass =
        'd1df8b8c3e828392b4a176a23cfe5668578f4edc5f18abdf3d468078505485be';
      sandbox.stub(auth, '_secureRandomPassword').resolves(pass);
    });

    it('should generate a password and store it', async () => {
      await auth._generateWalletPassword();
      expect(
        Keychain.setInternetCredentials,
        'was called with',
        '0_WalletPassword',
        'lightning',
        /^[0-9a-f]{64}$/
      );
      expect(store.wallet.newPassword, 'to match', /^[0-9a-f]{64}$/);
      expect(store.wallet.passwordVerify, 'to match', /^[0-9a-f]{64}$/);
      expect(wallet.checkNewPassword, 'was called once');
    });
  });

  describe('_unlockWallet()', () => {
    it('should not unlock wallet without hardware support', async () => {
      Keychain.getInternetCredentials.resolves({ password: 'some-password' });
      await auth._unlockWallet();
      expect(
        Keychain.getInternetCredentials,
        'was called with',
        '0_WalletPassword'
      );
      expect(store.wallet.password, 'to equal', 'some-password');
      expect(wallet.checkPassword, 'was called once');
    });
  });

  describe('_getFromKeyStore()', () => {
    it('should read keychain value', async () => {
      Keychain.getInternetCredentials.resolves({ password: 'some-password' });
      const value = await auth._getFromKeyStore('key');
      expect(value, 'to equal', 'some-password');
      expect(Keychain.getInternetCredentials, 'was called with', '0_key');
    });

    it('should get empty value from keychain', async () => {
      Keychain.getInternetCredentials.resolves(false);
      const value = await auth._getFromKeyStore('key');
      expect(value, 'to equal', null);
      expect(Keychain.getInternetCredentials, 'was called with', '0_key');
    });
  });

  describe('_secureRandomPassword()', () => {
    it('should generate hex encoded 256bit entropy password', async () => {
      const buf = Buffer.from(
        'd1df8b8c3e828392b4a176a23cfe5668578f4edc5f18abdf3d468078505485be',
        'hex'
      );
      Random.getRandomBytesAsync.resolves(new Uint8Array(buf));
      const pass = await auth._secureRandomPassword();
      expect(pass.length, 'to equal', 64);
    });
  });

  describe('askForHelp()', () => {
    it('should display action sheet on iOS', async () => {
      auth.askForHelp();
      expect(ActionSheetIOS.showActionSheetWithOptions, 'was called once');
    });

    it('should display alert on Android', async () => {
      Platform.OS = 'android';
      auth.askForHelp();
      expect(Alert.alert, 'was called once');
    });
  });

  describe('_initRestoreWallet()', () => {
    it('should init wallet restoration', async () => {
      auth._initRestoreWallet();
      expect(store.settings.restoring, 'to be', true);
      expect(wallet.initRestoreWallet, 'was called once');
    });
  });
});
