import { observe } from 'mobx';
import * as log from './logs';
import { RETRY_DELAY, PREFIX_URI, MNEMONIC_WALLET } from '../config';
import Mnemonic from 'bitcore-mnemonic';
import __DEV__ from 'electron-is-dev';

class ActionsWallet {
  constructor(store, actionsGrpc, actionsNav) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
    this._actionsNav = actionsNav;
    observe(this._store, 'lndReady', () => {
      this.getBalance();
      this.getChannelBalance();
      this.getNewAddress();
      this.getIPAddress();
    });

    observe(this._store, 'loaded', () => {
      this.initializeWallet();
    });
  }

  initializeWallet() {
    if (!MNEMONIC_WALLET) return;
    const { settings: { seedMnemonic } } = this._store;
    if (!seedMnemonic || !Mnemonic.isValid(seedMnemonic)) {
      const code = new Mnemonic(Mnemonic.Words.ENGLISH);
      this._store.settings.seedMnemonic = code.toString();
      this._store.save();
      this._actionsNav.goInitializeWallet();
    } else {
      __DEV__ && this._actionsNav.goPay();
    }
  }

  updateBalances() {
    this.getBalance();
    this.getChannelBalance();
  }

  getBalance() {
    this._actionsGrpc
      .sendCommand('WalletBalance')
      .then(response => {
        this._store.balanceSatoshis = response.total_balance;
        this._store.confirmedBalanceSatoshis = response.confirmed_balance;
        this._store.unconfirmedBalanceSatoshis = response.unconfirmed_balance;
      })
      .catch(() => {
        clearTimeout(this.t1);
        this.t1 = setTimeout(() => this.getBalance(), RETRY_DELAY);
      });
  }

  getChannelBalance() {
    this._actionsGrpc
      .sendCommand('ChannelBalance')
      .then(response => {
        this._store.channelBalanceSatoshis = response.balance;
      })
      .catch(() => {
        clearTimeout(this.t2);
        this.t2 = setTimeout(() => this.getChannelBalance(), RETRY_DELAY);
      });
  }

  generatePaymentRequest(amount, note) {
    return new Promise((resolve, reject) => {
      this._actionsGrpc
        .sendCommand('addInvoice', {
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
    this._actionsGrpc
      .sendCommand('NewAddress', {
        type: 1,
      })
      .then(response => {
        this._store.walletAddress = response.address;
      })
      .catch(() => {
        clearTimeout(this.t2342);
        this.t2342 = setTimeout(() => this.getNewAddress(), RETRY_DELAY);
      });
  }

  async getIPAddress() {
    try {
      const request = await fetch('https://api.ipify.org?format=json');
      const response = await request.json();
      this._store.ipAddress = response.ip;
    } catch (e) {
      log.error('Error fetching IP');
    }
  }
}

export default ActionsWallet;
