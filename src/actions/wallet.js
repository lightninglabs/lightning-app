import { observe } from 'mobx';
import store from '../store';
import ActionsGrpc from './grpc';
import { RETRY_DELAY } from '../config';

class ActionsWallet {
  constructor() {
    observe(store, 'lndReady', () => {
      this.getInfo();
      this.getBalance();
      this.getChannelBalance();

      this.getNewAddress();
    });
  }

  getBalance() {
    ActionsGrpc.sendCommand('WalletBalance')
      .then(response => {
        store.balanceSatoshis = response.total_balance;
        store.confirmedBalanceSatoshis = response.confirmed_balance;
        store.unconfirmedBalanceSatoshis = response.unconfirmed_balance;
      })
      .catch(() => {
        clearTimeout(this.t1);
        this.t1 = setTimeout(() => this.getBalance(), RETRY_DELAY);
      });
  }

  getChannelBalance() {
    ActionsGrpc.sendCommand('ChannelBalance')
      .then(response => {
        store.channelBalanceSatoshis = response.balance;
      })
      .catch(() => {
        clearTimeout(this.t2);
        this.t2 = setTimeout(() => this.getChannelBalance(), RETRY_DELAY);
      });
  }

  getNewAddress() {
    // - `p2wkh`: Pay to witness key hash (`WITNESS_PUBKEY_HASH` = 0)
    // - `np2wkh`: Pay to nested witness key hash (`NESTED_PUBKEY_HASH` = 1)
    // - `p2pkh`:  Pay to public key hash (`PUBKEY_HASH` = 2)
    ActionsGrpc.sendCommand('NewAddress', {
      type: 1,
    })
      .then(response => {
        store.walletAddress = response.address;
      })
      .catch(() => {
        clearTimeout(this.t2342);
        this.t2342 = setTimeout(() => this.getNewAddress(), RETRY_DELAY);
      });
  }

  getInfo() {
    ActionsGrpc.sendCommand('getInfo')
      .then(response => {
        store.pubKey = response.identity_pubkey;

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
      .catch(() => {
        clearTimeout(this.t3);
        this.t3 = setTimeout(() => this.getInfo(), RETRY_DELAY);
      });
  }
}

export default new ActionsWallet();
