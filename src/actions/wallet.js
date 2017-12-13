import { observe } from 'mobx';
import store from '../store';
import ActionsGrpc from './grpc';
import ActionsNav from './nav';
import { RETRY_DELAY, PREFIX_URI } from '../config';
import Mnemonic from 'bitcore-mnemonic';
import __DEV__ from 'electron-is-dev';

class ActionsWallet {
  constructor() {
    observe(store, 'lndReady', () => {
      this.getBalance();
      this.getChannelBalance();

      this.getNewAddress();
    });

    observe(store, 'loaded', () => {
      this.initializeWallet();
    });
  }

  initializeWallet() {
    if (!store.settings.seedMnemonic) {
      const code = new Mnemonic(Mnemonic.Words.ENGLISH);
      store.settings.seedMnemonic = code.toString();
      store.save();
      ActionsNav.goInitializeWallet();
    } else {
      __DEV__ && ActionsNav.goPay();
    }
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

  generatePaymentRequest(amount, note) {
    return new Promise((resolve, reject) => {
      ActionsGrpc.sendCommand('addInvoice', {
        value: amount,
        memo: note,
      })
        .then(response => {
          resolve(`${PREFIX_URI}${response.payment_request}`);
        })
        .catch(err => {
          reject(err);
        });
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
}

export default new ActionsWallet();
