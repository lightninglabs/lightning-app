/**
 * @fileOverview action to handle mobile wallet restore function like wiping
 * the local file system while keeping channel.db to enable restore using
 * the user's seed.
 */

class RestoreAction {
  constructor(store, grpc, wallet, FS) {
    this._store = store;
    this._grpc = grpc;
    this._wallet = wallet;
    this._FS = FS;
    this._docDir = this._FS.DocumentDirectoryPath;
  }

  /**
   * Initialize the restore wallet view by resetting input values and then
   * navigating to the view.
   * @return {undefined}
   */
  async initRestoreWallet() {
    // await this._grpc.sendCommand('StopDaemon');
    await this.wipeLndDirExceptChannelDB();
    this._store.settings.restoring = true;
    this._wallet.initRestoreWallet();
  }

  /**
   * Wipes all files in the lnd dir except the channel.db file. This
   * allows the user to restore their wallet (including channel state)
   * if they've they've forgotten the wallet pin/password.
   * @return {Promise<undefined>}
   */
  async wipeLndDirExceptChannelDB() {
    const network = 'testnet';
    const dataDir = `${this._docDir}/data`;
    const backupDir = `${this._docDir}/data_backup`;
    const dbDir = `graph/${network}`;
    const dbFile = 'channel.db';

    await this._FS.moveFile(dataDir, backupDir);
    await this._FS.mkdir(`${dataDir}/${dbDir}`);
    await this._FS.copyFile(
      `${backupDir}/${dbDir}/${dbFile}`,
      `${dataDir}/${dbDir}/${dbFile}`
    );
    await this._FS.unlink(backupDir);
  }
}

export default RestoreAction;
