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
  getLndDir() {
    return this._FS.DocumentDirectoryPath;
  }

  /**
   * Retrieves the entire lnd log file contents as a string.
   * @return {Promise<string>}
   */
  async readLogs() {
    const { network } = this._store;
    const path = `${this.getLndDir()}/logs/bitcoin/${network}/lnd.log`;
    return this._FS.readFile(path, 'utf8');
  }

  /**
   * Shares the log file using whatever native share function we have.
   * @return {Promise}
   */
  async shareLogs() {
    try {
      const logs = await this.readLogs();
      await this._Share.share({
        title: 'Lightning App logs',
        message: logs,
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
    const path = `${this.getLndDir()}/data/chain/bitcoin/${network}/wallet.db`;
    try {
      await this._FS.unlink(path);
    } catch (err) {
      log.info(`No ${network} wallet to delete.`);
    }
  }
}

export default FileAction;
