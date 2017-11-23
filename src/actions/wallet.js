import { observe } from 'mobx';
import store from '../store';
import ActionsGrpc from './grpc';

class ActionsWallet {
  constructor() {
    observe(store, 'lndReady', () => {
      this.getInfo();
    });
  }

  getInfo() {
    ActionsGrpc.sendCommand('getInfo')
      .then(response => {
        // TODO: Save more
        console.log('WALLET getInfo:', response);
        store.pubkey = response.identity_pubkey;

        // alias
        // :
        // ""
        // block_hash
        // :
        // "0621651bd82138072e726427b81d5b2f885f7844d94cc192aef6b55d624a3634"
        // block_height
        // :
        // 5221
        // chains
        // :
        // Array(1)
        // identity_pubkey
        // :
        // "024ac2d675533c795f385994daa0835b322c63ccb1e434f6448c97668a8fd0b91b"
        // num_active_channels
        // :
        // 0
        // num_peers
        // :
        // 0
        // num_pending_channels
        // :
        // 0
        // synced_to_chain
        // :
        // false
        // testnet
        // :
        // false
      })
      .catch(err => {
        console.log('WALLET ERROR getInfo', err);
      });
  }
}

export default new ActionsWallet();
