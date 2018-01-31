import { observe } from 'mobx';
import { RETRY_DELAY } from '../config';

class ActionsInfo {
  constructor(store, actionsGrpc) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
    observe(this._store, 'lndReady', () => {
      this.getInfo();
    });
  }

  async getInfo() {
    try {
      const response = await this._actionsGrpc.sendCommand('getInfo');
      this._store.pubKey = response.identity_pubkey;
    } catch (err) {
      clearTimeout(this.t3);
      this.t3 = setTimeout(() => this.getInfo(), RETRY_DELAY);
    }
  }
}

export default ActionsInfo;
