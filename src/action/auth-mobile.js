import { PIN_LENGTH } from '../config';

const PIN = 'DevicePin';
const PASS = 'WalletPassword';
const PASS_SIZE = 32; // 32 bytes (256 bits)

class AuthAction {
  constructor(store, nav, SecureStore, LocalAuthentication, Alert) {
    this._store = store;
    this._nav = nav;
    this._SecureStore = SecureStore;
    this._LocalAuthentication = LocalAuthentication;
    this._Alert = Alert;
    this.STORE = {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    };
  }

  //
  // Auth PIN actions
  //

  /**
   * Initialize the set pin view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initSetPin() {
    this._store.auth.newPin = '';
    this._store.auth.pinVerify = '';
    this._nav.goSetPin();
  }

  /**
   * Initialize the pin view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initPin() {
    this._store.auth.pin = '';
    this._nav.goPin();
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
      this._nav.goSetPinConfirm();
    } else if (param === 'pinVerify') {
      this.checkNewPin();
    } else if (param === 'pin') {
      this.checkPin();
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
    }
  }

  /**
   * Check the PIN that was chosen by the user has the correct
   * length and that it was also entered correctly twice to make sure that
   * there was no typo.
   * @return {Promise<undefined>}
   */
  async checkNewPin() {
    const { newPin, pinVerify } = this._store.auth;
    if (newPin !== pinVerify) {
      this._Alert.alert(
        'Incorrect PIN',
        'PINs do not match!',
        [
          {
            text: 'TRY AGAIN',
            onPress: () => this.initSetPin(),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    await this._SecureStore.setItemAsync(PIN, newPin, this.STORE);
    await this.unlockWallet();
  }

  async checkPin() {
    const { pin } = this._store.auth;
    const storedPin = await this._SecureStore.getItemAsync(PIN, this.STORE);
    if (pin !== storedPin) {
      this._Alert.alert(
        'Incorrect PIN',
        [
          {
            text: 'TRY AGAIN',
            onPress: () => this.initPin(),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    await this.unlockWallet();
  }

  //
  // Fingerprint Authentication
  //

  /**
   * Authenticate the user using either TouchID/FaceID on iOS or
   * a fingerprint reader on Android
   * @return {Promise<undefined>}
   */
  async authenticateUser() {
    const hasHardware = await this._LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return;
    }
    const msg = 'Unlock your Wallet';
    const { success } = await this._LocalAuthentication.authenticateAsync(msg);
    if (!success) {
      return;
    }
    await this.unlockWallet();
  }

  async unlockWallet() {
    const storedPass = await this._SecureStore.getItemAsync(PASS, this.STORE);
    if (storedPass) {
      this._store.password = storedPass;
      // await this._wallet.checkPassword();
      this._nav.goHome();
      return;
    }
    // If no password exists yet, generate a random one
    const newPass = this._totallyNotSecureRandomPassword();
    await this._SecureStore.setItemAsync(PASS, newPass, this.STORE);
    this._store.newPassword = newPass;
    this._store.passwordVerify = newPass;
    // await this._wallet.checkNewPassword();
    this._nav.goHome();
  }

  /**
   * NOT SECURE ... DO NOT USE IN PRODUCTION !!!
   *
   * Just a stop gap during development until we have a secure native
   * PRNG: https://github.com/lightninglabs/lightning-app/issues/777
   *
   * Generate some hex bytes for a random wallet password on mobile
   * (which will be stretched using a KDF in lnd).
   * @return {string}      A hex string containing some random bytes
   */
  _totallyNotSecureRandomPassword() {
    const bytes = new Uint8Array(PASS_SIZE);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(256 * Math.random());
    }
    return Buffer.from(bytes.buffer).toString('hex');
  }
}

export default AuthAction;
