import * as log from './logs';
import { RETRY_DELAY, PREFIX_URI, MNEMONIC_WALLET } from '../config';
import Mnemonic from 'bitcore-mnemonic';
import __DEV__ from 'electron-is-dev';

class ActionsWallet {
  constructor(store, actionsGrpc, actionsNav) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
    this._actionsNav = actionsNav;
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

  async getBalance() {
    try {
      const response = await this._actionsGrpc.sendCommand('WalletBalance');
      this._store.balanceSatoshis = response.total_balance;
      this._store.confirmedBalanceSatoshis = response.confirmed_balance;
      this._store.unconfirmedBalanceSatoshis = response.unconfirmed_balance;
    } catch (err) {
      clearTimeout(this.t1);
      this.t1 = setTimeout(() => this.getBalance(), RETRY_DELAY);
    }
  }

  async getChannelBalance() {
    try {
      const response = await this._actionsGrpc.sendCommand('ChannelBalance');
      this._store.channelBalanceSatoshis = response.balance;
    } catch (err) {
      clearTimeout(this.t2);
      this.t2 = setTimeout(() => this.getChannelBalance(), RETRY_DELAY);
    }
  }

  async generatePaymentRequest(amount, note) {
    const response = await this._actionsGrpc.sendCommand('addInvoice', {
      value: amount,
      memo: note,
    });
    return `${PREFIX_URI}${response.payment_request}`;
  }

  async getNewAddress() {
    // - `p2wkh`: Pay to witness key hash (`WITNESS_PUBKEY_HASH` = 0)
    // - `np2wkh`: Pay to nested witness key hash (`NESTED_PUBKEY_HASH` = 1)
    // - `p2pkh`:  Pay to public key hash (`PUBKEY_HASH` = 2)
    try {
      const { address } = await this._actionsGrpc.sendCommand('NewAddress', {
        type: 1,
      });
      this._store.walletAddress = address;
    } catch (err) {
      clearTimeout(this.t2342);
      this.t2342 = setTimeout(() => this.getNewAddress(), RETRY_DELAY);
    }
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
