import { RETRY_DELAY } from '../config';
import * as log from './log';

class InfoAction {
  constructor(store, grpc, notification) {
    this._store = store;
    this._grpc = grpc;
    this._notification = notification;
  }

  async getInfo() {
    try {
      const response = await this._grpc.sendCommand('getInfo');
      this._store.pubKey = response.identity_pubkey;
      this._store.syncedToChain = response.synced_to_chain;
      this._store.blockHeight = response.block_height;
      if (!response.synced_to_chain) {
        this._notification.display({ msg: 'Syncing to chain ...' });
        clearTimeout(this.t3);
        this.t3 = setTimeout(() => this.getInfo(), RETRY_DELAY);
      }
    } catch (err) {
      log.error('Getting node info failed', err);
    }
  }
}

export default InfoAction;
