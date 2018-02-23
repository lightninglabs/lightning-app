import { RETRY_DELAY } from '../config';

class ActionsInfo {
  constructor(store, actionsGrpc) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
  }

  async getInfo() {
    try {
      const response = await this._actionsGrpc.sendCommand('getInfo');
      this._store.pubKey = response.identity_pubkey;
      this._store.syncedToChain = response.synced_to_chain;
      this._store.blockHeight = response.block_height;
      if (!response.synced_to_chain) {
        clearTimeout(this.t3);
        this.t3 = setTimeout(() => this.getInfo(), RETRY_DELAY);
      }
    } catch (err) {
      clearTimeout(this.t3);
      this.t3 = setTimeout(() => this.getInfo(), RETRY_DELAY);
    }
  }
}

export default ActionsInfo;
