/**
 * @fileOverview action to handle secure key storage to platform apis.
 */

const VERSION = '0';
const USER = 'lightning';

class KeychainAction {
  constructor(RNKeychain) {
    this._RNKeychain = RNKeychain;
  }

  /**
   * Store an item in the keychain.
   * @param {string} key   The key by which to do a lookup
   * @param {string} value The value to be stored
   * @return {Promise<undefined>}
   */
  async setItem(key, value) {
    const options = {
      accessible: this._RNKeychain.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    };
    const vKey = `${VERSION}_${key}`;
    await this._RNKeychain.setInternetCredentials(vKey, USER, value, options);
  }

  /**
   * Read an item stored in the keychain.
   * @param  {string} key      The key by which to do a lookup.
   * @return {Promise<string>} The stored value
   */
  async getItem(key) {
    const vKey = `${VERSION}_${key}`;
    const credentials = await this._RNKeychain.getInternetCredentials(vKey);
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  }
}

export default KeychainAction;
