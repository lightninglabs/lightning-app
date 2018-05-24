import { toBuffer, parseSat, checkHttpStatus } from '../helper';
import * as log from './log';

class WalletAction {
  constructor(store, grpc, notification) {
    this._store = store;
    this._grpc = grpc;
    this._notification = notification;
  }

  async generateSeed() {
    try {
      const response = await this._grpc.sendUnlockerCommand('GenSeed');
      this._store.seedMnemonic = response.cipher_seed_mnemonic;
    } catch (err) {
      this._notification.display({ msg: 'Generating seed failed', err });
    }
  }

  async initWallet({ walletPassword, seedMnemonic }) {
    try {
      await this._grpc.sendUnlockerCommand('InitWallet', {
        wallet_password: toBuffer(walletPassword),
        cipher_seed_mnemonic: seedMnemonic,
      });
      this._store.walletUnlocked = true;
    } catch (err) {
      this._notification.display({ msg: 'Initializing wallet failed', err });
    }
  }

  async unlockWallet({ walletPassword }) {
    try {
      await this._grpc.sendUnlockerCommand('UnlockWallet', {
        wallet_password: toBuffer(walletPassword),
      });
      this._store.walletUnlocked = true;
    } catch (err) {
      this._notification.display({ msg: 'Unlocking wallet failed', err });
    }
  }

  toggleDisplayFiat() {
    this._store.settings.displayFiat = !this._store.settings.displayFiat;
  }

  async getBalance() {
    try {
      const r = await this._grpc.sendCommand('WalletBalance');
      this._store.balanceSatoshis = parseSat(r.total_balance);
      this._store.confirmedBalanceSatoshis = parseSat(r.confirmed_balance);
      this._store.unconfirmedBalanceSatoshis = parseSat(r.unconfirmed_balance);
    } catch (err) {
      log.error('Getting wallet balance failed', err);
    }
  }

  async getChannelBalance() {
    try {
      const response = await this._grpc.sendCommand('ChannelBalance');
      this._store.channelBalanceSatoshis = parseSat(response.balance);
    } catch (err) {
      log.error('Getting channel balance failed', err);
    }
  }

  async getNewAddress() {
    // - `p2wkh`: Pay to witness key hash (`WITNESS_PUBKEY_HASH` = 0)
    // - `np2wkh`: Pay to nested witness key hash (`NESTED_PUBKEY_HASH` = 1)
    // - `p2pkh`:  Pay to public key hash (`PUBKEY_HASH` = 2)
    try {
      const { address } = await this._grpc.sendCommand('NewAddress', {
        type: 1,
      });
      this._store.walletAddress = address;
    } catch (err) {
      log.error('Getting new wallet address failed', err);
    }
  }

  async getExchangeRate() {
    try {
      const fiat = this._store.settings.fiat;
      const uri = `https://blockchain.info/tobtc?currency=${fiat}&value=1`;
      const response = checkHttpStatus(await fetch(uri));
      this._store.settings.exchangeRate[fiat] = Number(await response.text());
    } catch (err) {
      log.error('Getting exchange rate failed', err);
    }
  }
}

export default WalletAction;
