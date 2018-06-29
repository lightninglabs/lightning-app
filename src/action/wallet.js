import { toBuffer, parseSat, checkHttpStatus, nap } from '../helper';
import { MIN_PASSWORD_LENGTH, NOTIFICATION_DELAY } from '../config';
import * as log from './log';

class WalletAction {
  constructor(store, grpc, nav, notification) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
  }

  //
  // Verify Seed actions
  //

  initSeedVerify() {
    this._store.wallet.seedVerify = ['', '', ''];
    this._nav.goSeedVerify();
  }

  setSeedVerify({ word, index }) {
    this._store.wallet.seedVerify[index] = word;
  }

  //
  // Wallet Password actions
  //

  initSetPassword() {
    this._store.wallet.password = '';
    this._store.wallet.passwordVerify = '';
    this._nav.goSetPassword();
  }

  initPassword() {
    this._store.wallet.password = '';
    this._nav.goPassword();
  }

  setPassword({ password }) {
    this._store.wallet.password = password;
  }

  setPasswordVerify({ password }) {
    this._store.wallet.passwordVerify = password;
  }

  //
  // Wallet actions
  //

  async init() {
    try {
      await this.generateSeed();
      this._nav.goLoader();
      await nap(NOTIFICATION_DELAY);
      this._nav.goSeed();
    } catch (err) {
      this.initPassword();
    }
  }

  async update() {
    await Promise.all([
      this.getBalance(),
      this.getChannelBalance(),
      this.getNewAddress(),
      this.getExchangeRate(),
    ]);
  }

  async generateSeed() {
    const response = await this._grpc.sendUnlockerCommand('GenSeed');
    this._store.seedMnemonic = response.cipher_seed_mnemonic;
  }

  async checkSeed() {
    const {
      wallet: { seedVerify },
      seedMnemonic,
      seedVerifyIndexes,
    } = this._store;
    if (
      seedVerify[0] !== seedMnemonic[seedVerifyIndexes[0] - 1] ||
      seedVerify[1] !== seedMnemonic[seedVerifyIndexes[1] - 1] ||
      seedVerify[2] !== seedMnemonic[seedVerifyIndexes[2] - 1]
    ) {
      return this._notification.display({ msg: 'Seed words do not match!' });
    }
    this.initSetPassword();
  }

  async checkNewPassword() {
    const { password, passwordVerify } = this._store.wallet;
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return this._notification.display({
        msg: `Set a password with at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }
    if (password !== passwordVerify) {
      return this._notification.display({ msg: 'Passwords do not match!' });
    }
    await this.initWallet({
      walletPassword: password,
      seedMnemonic: this._store.seedMnemonic.toJSON(),
    });
  }

  async initWallet({ walletPassword, seedMnemonic }) {
    try {
      await this._grpc.sendUnlockerCommand('InitWallet', {
        wallet_password: toBuffer(walletPassword),
        cipher_seed_mnemonic: seedMnemonic,
      });
      this._store.walletUnlocked = true;
      this._nav.goSeedSuccess();
    } catch (err) {
      this._notification.display({ msg: 'Initializing wallet failed', err });
    }
  }

  async checkPassword() {
    const { password } = this._store.wallet;
    await this.unlockWallet({ walletPassword: password });
  }

  async unlockWallet({ walletPassword }) {
    try {
      await this._grpc.sendUnlockerCommand('UnlockWallet', {
        wallet_password: toBuffer(walletPassword),
      });
      this._store.walletUnlocked = true;
      this._nav.goHome();
    } catch (err) {
      this._notification.display({ type: 'error', msg: 'Invalid password' });
    }
  }

  toggleDisplayFiat() {
    this._store.settings.displayFiat = !this._store.settings.displayFiat;
    this._store.save();
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
      this._store.save();
    } catch (err) {
      log.error('Getting exchange rate failed', err);
    }
  }
}

export default WalletAction;
