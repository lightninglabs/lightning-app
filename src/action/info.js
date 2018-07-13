import { RETRY_DELAY } from '../config';
import { observe } from 'mobx';
import * as log from './log';

class InfoAction {
  constructor(store, grpc, nav, notification) {
    this._store = store;
    this._nav = nav;
    this._grpc = grpc;
    this._notification = notification;
    this.firstTime = true;
  }

  async getInfo() {
    try {
      const response = await this._grpc.sendCommand('getInfo');
      this._store.pubKey = response.identity_pubkey;
      this._store.syncedToChain = response.synced_to_chain;
      this._store.blockHeight = response.block_height;
      if (this.firstTime) {
        this.startingSyncTimestamp = response.best_header_timestamp || 0;
        this.firstTime = false;
      }
      if (!response.synced_to_chain) {
        this._notification.display({ msg: 'Syncing to chain', wait: true });
        log.info(`Syncing to chain ... block height: ${response.block_height}`);
        this._store.percentSynced = this.calcPercentSynced(response);
        clearTimeout(this.t3);
        this.t3 = setTimeout(() => this.getInfo(), RETRY_DELAY);
      }
    } catch (err) {
      log.error('Getting node info failed', err);
    }
  }

  finishOnboarding() {
    if (this._store.syncedToChain) {
      this._nav.goHome();
    } else {
      this._nav.goLoaderSyncing();
      observe(this._store, 'syncedToChain', () => this._nav.goHome());
    }
  }

  calcPercentSynced(response) {
    const bestHeaderTimestamp = response.best_header_timestamp;
    const currTimestamp = new Date().getTime() / 1000;
    const progressSoFar = bestHeaderTimestamp
      ? bestHeaderTimestamp - this.startingSyncTimestamp
      : 0;
    const totalProgress = currTimestamp - this.startingSyncTimestamp;
    const percentSynced = progressSoFar * 1.0 / totalProgress;
    return percentSynced;
  }
}

export default InfoAction;
