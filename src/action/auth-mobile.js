/**
 * @fileOverview action to handle mobile specific authentication
 * using PINs, TouchID, and KeyStore storage.
 */

import { PIN_LENGTH } from '../config';

const PIN = 'DevicePin';
const PASS = 'WalletPassword';

class AuthAction {
  constructor(store, wallet, nav, SecureStore, Fingerprint, Alert) {
    this._store = store;
    this._wallet = wallet;
    this._nav = nav;
    this._SecureStore = SecureStore;
    this._Fingerprint = Fingerprint;
    this._Alert = Alert;
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
    this._nav.goResetPinCurrent();
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
      this._nav.goResetPinNew();
    } else if (param === 'resetPinNew') {
      this._nav.goResetPinConfirm();
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
    } else if (param === 'resetPinNew') {
      this.initResetPin();
    } else if (param === 'resetPinVerify') {
      this._store.auth.resetPinNew = '';
      this._nav.goResetPinNew();
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
    this._nav.goResetPinSaved();
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
    const newPass = this._totallyNotSecureRandomPassword();
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

  _getFromKeyStore(key) {
    const options = {
      keychainAccessible: this._SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    };
    return this._SecureStore.getItemAsync(key, options);
  }

  _setToKeyStore(key, value) {
    const options = {
      keychainAccessible: this._SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    };
    return this._SecureStore.setItemAsync(key, value, options);
  }

  _alert(title, callback) {
    this._Alert.alert(title, '', [{ text: 'TRY AGAIN', onPress: callback }]);
  }

  /**
   * NOT SECURE ... DO NOT USE IN PRODUCTION !!!
   *
   * Just a stop gap during development until we have a secure native
   * PRNG: https://github.com/lightninglabs/lightning-app/issues/777
   *
   * Generate a hex encoded 256 bit entropy wallet password (which will
   * be stretched using a KDF in lnd).
   * @return {string}      A hex string containing some random bytes
   */
  _totallyNotSecureRandomPassword() {
    const bytes = new Uint8Array(32);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(256 * Math.random());
    }
    return Buffer.from(bytes.buffer).toString('hex');
  }
}

export default AuthAction;
