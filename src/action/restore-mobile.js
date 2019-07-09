/**
 * @fileOverview action to handle mobile wallet restore function like wiping
 * the local file system while keeping channel.db to enable restore using
 * the user's seed.
 */

import * as log from './log';

class RestoreAction {
  constructor(store, grpc, wallet, FS) {
    this._store = store;
    this._grpc = grpc;
    this._wallet = wallet;
    this._FS = FS;
  }

  /**
   * Initialize wallet restore by wiping all wallet.db files from disk and
   * then initializing wallet restore from the seed.
   * @return {Promise<undefined>}
   */
  async initRestoreWallet() {
    await Promise.all([
      this.deleteWalletDB('testnet'),
      this.deleteWalletDB('mainnet'),
    ]);
    this._store.settings.restoring = true;
    this._wallet.initRestoreWallet();
  }

  /**
   * Delete the wallet.db file. This allows the user to restore their wallet
   * (including channel state) from the seed if they've they've forgotten the
   * wallet pin/password.
   * @return {Promise<undefined>}
   */
  async deleteWalletDB(network) {
    const lndDir = this._FS.DocumentDirectoryPath;
    const dbPath = `${lndDir}/data/chain/bitcoin/${network}/wallet.db`;
    try {
      await this._FS.unlink(dbPath);
    } catch (err) {
      log.info(`No ${network} wallet to delete.`);
    }
  }
}

export default RestoreAction;
