/**
 * @fileOverview action to handle mobile specific authentication
 * using PINs, TouchID, and KeyStore storage.
 */

import { PIN_LENGTH } from '../config';

const VERSION = '0';
const PIN = 'DevicePin';
const PASS = 'WalletPassword';
const USER = 'lightning';

class AuthAction {
  constructor(
    store,
    wallet,
    nav,
    Random,
    Keychain,
    Fingerprint,
    Alert,
    ActionSheetIOS,
    Platform
  ) {
    this._store = store;
    this._wallet = wallet;
    this._nav = nav;
    this._Random = Random;
    this._Keychain = Keychain;
    this._Fingerprint = Fingerprint;
    this._Alert = Alert;
    this._ActionSheetIOS = ActionSheetIOS;
    this._Platform = Platform;
  }

  //
  // PIN actions
  //

  /**
   * Initialize the set pin view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initSetPin() {
    this._store.auth.newPin = '';
    this._store.auth.pinVerify = '';
    this._nav.goSetPassword();
  }

  /**
   * Initialize the pin view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initPin() {
    this._store.auth.pin = '';
    this._nav.goPassword();
  }

  /**
   * Initialize the reset pin flow by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initResetPin() {
    this._store.auth.resetPinCurrent = '';
    this._store.auth.resetPinNew = '';
    this._store.auth.resetPinVerify = '';
    this._nav.goResetPasswordCurrent();
  }

  /**
   * Initialize the reset new pin flow by resetting new values
   * and then navigating to the new pin view.
   * @return {undefined}
   */
  initResetPinNew() {
    this._store.auth.resetPinNew = '';
    this._store.auth.resetPinVerify = '';
    this._nav.goResetPasswordNew();
  }

  /**
   * Append a digit input to the pin parameter.
   * @param  {string} options.digit The digit to append to the pin
   * @param  {string} options.param The pin parameter name
   * @return {undefined}
   */
  pushPinDigit({ digit, param }) {
    const { auth } = this._store;
    if (auth[param].length < PIN_LENGTH) {
      auth[param] += digit;
    }
    if (auth[param].length < PIN_LENGTH) {
      return;
    }
    if (param === 'newPin') {
      this._nav.goSetPasswordConfirm();
    } else if (param === 'pinVerify') {
      this.checkNewPin();
    } else if (param === 'pin') {
      this.checkPin();
    } else if (param === 'resetPinCurrent') {
      this._nav.goResetPasswordNew();
    } else if (param === 'resetPinNew') {
      this._nav.goResetPasswordConfirm();
    } else if (param === 'resetPinVerify') {
      this.checkResetPin();
    }
  }

  /**
   * Remove the last digit from the pin parameter.
   * @param  {string} options.param The pin parameter name
   * @return {undefined}
   */
  popPinDigit({ param }) {
    const { auth } = this._store;
    if (auth[param]) {
      auth[param] = auth[param].slice(0, -1);
    } else if (param === 'pinVerify') {
      this.initSetPin();
    } else if (param === 'resetPinCurrent') {
      this._nav.goSettings();
    } else if (param === 'resetPinNew') {
      this.initResetPin();
    } else if (param === 'resetPinVerify') {
      this.initResetPinNew();
    }
  }

  /**
   * Check the PIN that was chosen by the user was entered
   * correctly twice to make sure that there was no typo.
   * If everything is ok, store the pin in the keystore and
   * unlock the wallet.
   * @return {Promise<undefined>}
   */
  async checkNewPin() {
    const { newPin, pinVerify } = this._store.auth;
    if (newPin.length !== PIN_LENGTH || newPin !== pinVerify) {
      this._alert("PINs don't match", () => this.initSetPin());
      return;
    }
    await this._setToKeyStore(PIN, newPin);
    await this._generateWalletPassword();
  }

  /**
   * Check the PIN that was entered by the user in the unlock
   * screen matches the pin stored in the keystore and unlock
   * the wallet.
   * @return {Promise<undefined>}
   */
  async checkPin() {
    const { pin } = this._store.auth;
    const storedPin = await this._getFromKeyStore(PIN);
    if (pin !== storedPin) {
      this._alert('Incorrect PIN', () => this.initPin());
      return;
    }
    await this._unlockWallet();
  }

  /**
   * Check that the pin that was chosen by the user doesn't match
   * their current pin, and that it was entered correctly twice.
   * If everything is ok, store the pin in the keystore and redirect
   * to home.
   * @return {undefined}
   */
  async checkResetPin() {
    const { resetPinCurrent, resetPinNew, resetPinVerify } = this._store.auth;
    const storedPin = await this._getFromKeyStore(PIN);
    if (resetPinCurrent !== storedPin) {
      this._alert('Incorrect PIN', () => this.initResetPin());
      return;
    } else if (resetPinCurrent === resetPinNew) {
      this._alert('New PIN must not match old PIN', () => this.initResetPin());
      return;
    } else if (
      resetPinNew.length !== PIN_LENGTH ||
      resetPinNew !== resetPinVerify
    ) {
      this._alert("PINs don't match", () => this.initResetPin());
      return;
    }
    await this._setToKeyStore(PIN, resetPinNew);
    this._nav.goResetPasswordSaved();
  }

  //
  // TouchID & KeyStore Authentication
  //

  /**
   * Try authenticating the user using either via TouchID/FaceID on iOS
   * or a fingerprint reader on Android.
   * @return {Promise<undefined>}
   */
  async tryFingerprint() {
    const hasHardware = await this._Fingerprint.hasHardwareAsync();
    const isEnrolled = await this._Fingerprint.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      return;
    }
    const msg = 'Unlock your Wallet';
    const { success } = await this._Fingerprint.authenticateAsync(msg);
    if (!success) {
      return;
    }
    await this._unlockWallet();
  }

  /**
   * A new wallet password is generated and stored in the keystore
   * during device setup. This password is not intended to be displayed
   * to the user but is unlocked at the application layer via TouchID
   * or PIN (which is stored in the keystore).
   * @return {Promise<undefined>}
   */
  async _generateWalletPassword() {
    const newPass = await this._secureRandomPassword();
    await this._setToKeyStore(PASS, newPass);
    this._store.wallet.newPassword = newPass;
    this._store.wallet.passwordVerify = newPass;
    await this._wallet.checkNewPassword();
  }

  /**
   * Unlock the wallet using a randomly generated password that is
   * stored in the keystore. This password is not intended to be displayed
   * to the user but rather unlocked at the application layer.
   * @return {Promise<undefined>}
   */
  async _unlockWallet() {
    const storedPass = await this._getFromKeyStore(PASS);
    this._store.wallet.password = storedPass;
    await this._wallet.checkPassword();
  }

  async _getFromKeyStore(key) {
    const vKey = `${VERSION}_${key}`;
    const credentials = await this._Keychain.getInternetCredentials(vKey);
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  }

  _setToKeyStore(key, value) {
    const options = {
      accessible: this._Keychain.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    };
    const vKey = `${VERSION}_${key}`;
    return this._Keychain.setInternetCredentials(vKey, USER, value, options);
  }

  _alert(title, callback) {
    this._Alert.alert(title, '', [{ text: 'TRY AGAIN', onPress: callback }]);
  }

  /**
   * Generate a random hex encoded 256 bit entropy wallet password.
   * @return {Promise<string>} A hex string containing some random bytes
   */
  async _secureRandomPassword() {
    const bytes = await this._Random.getRandomBytesAsync(32);
    return Buffer.from(bytes.buffer).toString('hex');
  }

  //
  // Help / Restore actions
  //

  askForHelp() {
    const message =
      "If you have forgotten your PIN, or you're locked out of your wallet, you can reset your PIN with your Recovery Phrase.";
    const action = 'Recover My Wallet';
    const cancel = 'Cancel';
    if (this._Platform.OS === 'ios') {
      this._ActionSheetIOS.showActionSheetWithOptions(
        {
          message,
          options: [cancel, action],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1,
        },
        i => i === 1 && this._initRestoreWallet()
      );
    } else {
      this._Alert.alert(null, message, [
        {
          text: action,
          onPress: () => this._initRestoreWallet(),
        },
        { text: cancel, style: 'cancel' },
      ]);
    }
  }

  _initRestoreWallet() {
    this._store.settings.restoring = true;
    this._wallet.initRestoreWallet();
  }
}

export default AuthAction;
