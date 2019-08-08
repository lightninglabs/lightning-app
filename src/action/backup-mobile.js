/**
 * @fileOverview action to handle static channel backup (SCB) to local
 * storage options as well as to cloud storage. On iOS the iCloud key/value
 * store is used. On Android we store backups to external storage on device
 * for local backups.
 */

import * as log from './log';

const SCB_KEY = 'channel.backup';

class BackupAction {
  constructor(grpc, file, Platform, DeviceInfo, Permissions, iCloudStorage) {
    this._grpc = grpc;
    this._file = file;
    this._Platform = Platform;
    this._DeviceInfo = DeviceInfo;
    this._Permissions = Permissions;
    this._iCloudStorage = iCloudStorage;
  }

  //
  // Backup actions
  //

  /**
   * Push a channel backup to external storage or iCloud.
   * @return {Promise<undefined>}
   */
  async pushChannelBackup() {
    if (this._Platform.OS === 'ios') {
      await this.pushToICloud();
    } else if (this._Platform.OS === 'android') {
      await this.pushToExternalStorage();
    }
  }

  async pushToICloud() {
    try {
      const scbBase64 = await this._file.readSCB();
      if (!scbBase64) return;
      const json = this.stringify(scbBase64);
      await this._iCloudStorage.setItem(this.itemKey, json);
    } catch (err) {
      log.error('Uploading channel backup to iCloud failed', err);
    }
  }

  async requestPermissionForExternalStorage() {
    const granted = await await this._Permissions.request(
      this._Permissions.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    return granted === this._Permissions.RESULTS.GRANTED;
  }

  async pushToExternalStorage() {
    const permission = await this.requestPermissionForExternalStorage();
    if (!permission) {
      log.info('Skipping channel backup due to missing permissions');
      return;
    }
    try {
      await this._file.copySCBToExternalStorage();
    } catch (err) {
      log.error('Copying channel backup to external storage failed', err);
    }
  }

  /**
   * Subscribe to channel backup updates. If a new one comes in, back up the
   * latest update.
   * @return {undefined}
   */
  async subscribeChannelBackups() {
    const stream = this._grpc.sendStreamCommand('subscribeChannelBackups');
    stream.on('data', () => this.pushChannelBackup());
    stream.on('error', err => log.error('Channel backup error:', err));
    stream.on('status', status => log.info(`Channel backup status: ${status}`));
  }

  //
  // Restore actions
  //

  async fetchChannelBackup() {
    let scbBase64;
    if (this._Platform.OS === 'ios') {
      scbBase64 = await this.fetchFromICloud();
    } else if (this._Platform.OS === 'android') {
      scbBase64 = await this.fetchFromExternalStorage();
    }
    return scbBase64 ? Buffer.from(scbBase64, 'base64') : null;
  }

  async fetchFromICloud() {
    try {
      const json = await this._iCloudStorage.getItem(this.itemKey);
      return json ? this.parse(json).data : null;
    } catch (err) {
      log.info(`Failed to read channel backup from iCloud: ${err.message}`);
    }
  }

  async fetchFromExternalStorage() {
    const permission = await this.requestPermissionForExternalStorage();
    if (!permission) {
      log.info('Skipping channel restore: missing storage permissions');
      return;
    }
    try {
      return this._file.readSCBFromExternalStorage();
    } catch (err) {
      log.info(`Failed to read channel backup from external: ${err.message}`);
    }
  }

  //
  // Helper functions
  //

  get shortId() {
    return this._DeviceInfo
      .getUniqueID()
      .replace(/-/g, '')
      .slice(0, 7)
      .toLowerCase();
  }

  get itemKey() {
    return `${this.shortId}_${SCB_KEY}`;
  }

  stringify(scbBase64) {
    return JSON.stringify({
      device: this._DeviceInfo.getDeviceId(),
      data: scbBase64,
      time: new Date().toISOString(),
    });
  }

  parse(json) {
    return JSON.parse(json);
  }
}

export default BackupAction;
