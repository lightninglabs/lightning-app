import { RETRY_DELAY } from '../config';

class WalletAction {
  constructor(store, grpc, notification) {
    this._store = store;
    this._grpc = grpc;
    this._notification = notification;
  }

  async generateSeed({ seedPassphrase }) {
    try {
      const response = await this._grpc.sendUnlockerCommand('GenSeed', {
        aezeed_passphrase: seedPassphrase,
      });
      this._store.seedMnemonic = response.cipher_seed_mnemonic;
    } catch (err) {
      this._notification.display({ msg: 'Generating seed failed', err });
    }
  }

  async initWallet({ walletPassword, seedPassphrase, seedMnemonic }) {
    try {
      await this._grpc.sendUnlockerCommand('InitWallet', {
        wallet_password: walletPassword,
        aezeed_passphrase: seedPassphrase,
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
        wallet_password: walletPassword,
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
      const res = await this._grpc.sendCommand('WalletBalance');
      this._store.balanceSatoshis = Number(res.total_balance);
      this._store.confirmedBalanceSatoshis = Number(res.confirmed_balance);
      this._store.unconfirmedBalanceSatoshis = Number(res.unconfirmed_balance);
    } catch (err) {
      clearTimeout(this.t1);
      this.t1 = setTimeout(() => this.getBalance(), RETRY_DELAY);
    }
  }

  async getChannelBalance() {
    try {
      const response = await this._grpc.sendCommand('ChannelBalance');
      this._store.channelBalanceSatoshis = Number(response.balance);
    } catch (err) {
      clearTimeout(this.t2);
      this.t2 = setTimeout(() => this.getChannelBalance(), RETRY_DELAY);
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
      clearTimeout(this.t2342);
      this.t2342 = setTimeout(() => this.getNewAddress(), RETRY_DELAY);
    }
  }

  async getIPAddress() {
    try {
      const request = await fetch('https://api.ipify.org?format=json');
      const response = await request.json();
      this._store.ipAddress = response.ip;
    } catch (err) {
      this._notification.display({ msg: 'Getting IP address failed', err });
    }
  }

  async getExchangeRate() {
    try {
      const fiat = this._store.settings.fiat;
      const uri = `https://blockchain.info/tobtc?currency=${fiat}&value=1`;
      const response = this._checkStatus(await fetch(uri));
      this._store.settings.exchangeRate[fiat] = Number(await response.text());
    } catch (err) {
      this._notification.display({ msg: 'Getting exchange rate failed', err });
    }
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(response.statusText);
    }
  }
}

export default WalletAction;
