/**
 * @fileOverview actions wrapping file I/O operations on mobile.
 */

import * as log from './log';

class FileAction {
  constructor(store, FS, Share) {
    this._store = store;
    this._FS = FS;
    this._Share = Share;
  }

  /**
   * Gets the path of the lnd directory where `logs` and `data` are stored.
   * @return {string}
   */
  get lndDir() {
    return this._FS.DocumentDirectoryPath;
  }

  /**
   * Gets the path of the current network's log file.
   * @return {string}
   */
  get logsPath() {
    const { network } = this._store;
    return `${this.lndDir}/logs/bitcoin/${network}/lnd.log`;
  }

  /**
   * Shares the log file using whatever native share function we have.
   * @return {Promise}
   */
  async shareLogs() {
    try {
      await this._Share.open({
        url: `file://${this.logsPath}`,
        type: 'text/plain',
      });
    } catch (err) {
      log.error('Exporting logs failed', err);
    }
  }

  /**
   * Delete the wallet.db file. This allows the user to restore their wallet
   * (including channel state) from the seed if they've forgotten the pin.
   * @return {Promise<undefined>}
   */
  async deleteWalletDB(network) {
    const path = `${this.lndDir}/data/chain/bitcoin/${network}/wallet.db`;
    try {
      await this._FS.unlink(path);
    } catch (err) {
      log.info(`No ${network} wallet to delete.`);
    }
  }
}

export default FileAction;
