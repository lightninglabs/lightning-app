/**
 * @fileOverview actions to set wallet state within the app and to
 * call the corresponding GRPC apis for updating wallet balances.
 */

import { observe, when } from 'mobx';
import { toBuffer, parseSat, checkHttpStatus, nap, poll } from '../helper';
import { MIN_PASSWORD_LENGTH, NOTIFICATION_DELAY, RATE_DELAY } from '../config';
import * as log from './log';

class WalletAction {
  constructor(store, grpc, db, nav, notification) {
    this._store = store;
    this._grpc = grpc;
    this._db = db;
    this._nav = nav;
    this._notification = notification;
  }

  //
  // Verify Seed actions
  //

  /**
   * Initialize the seed verify view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initSeedVerify() {
    this._store.wallet.seedVerify = ['', '', ''];
    this._nav.goSeedVerify();
  }

  /**
   * Set the verify seed input by validation the seed word and
   * seed index.
   * @param {string} options.word  The seed word
   * @param {number} options.index The seed index
   */
  setSeedVerify({ word = '', index }) {
    this._store.wallet.seedVerify[index] = word.toLowerCase();
  }

  //
  // Wallet Password actions
  //

  /**
   * Initialize the set password view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initSetPassword() {
    this._store.wallet.password = '';
    this._store.wallet.passwordVerify = '';
    this._nav.goSetPassword();
  }

  /**
   * Initialize the password view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initPassword() {
    this._store.wallet.password = '';
    this._nav.goPassword();
  }

  /**
   * Set the password input for the password view.
   * @param {string} options.password The wallet password
   */
  setPassword({ password }) {
    this._store.wallet.password = password;
  }

  /**
   * Set the verify password input for the password view.
   * @param {string} options.password The wallet password a second time
   */
  setPasswordVerify({ password }) {
    this._store.wallet.passwordVerify = password;
  }

  //
  // Wallet actions
  //

  /**
   * Initialize the wallet by trying to generate a new seed. If seed
   * generation in lnd fails, the app assumes a wallet already exists
   * and wallet unlock via password input will be initiated.
   * @return {Promise<undefined>}
   */
  async init() {
    try {
      await this.generateSeed();
      this._store.firstStart = true;
      this._nav.goLoader();
      await nap(NOTIFICATION_DELAY);
      this._nav.goSeed();
    } catch (err) {
      this.initPassword();
    }
  }

  /**
   * Update the wallet on-chain and channel balances.
   * @return {Promise<undefined>}
   */
  async update() {
    await Promise.all([this.getBalance(), this.getChannelBalance()]);
  }

  /**
   * Poll the wallet balances in the background since there is no streaming
   * grpc api yet
   * @return {Promise<undefined>}
   */
  async pollBalances() {
    await poll(() => this.update());
  }

  /**
   * Generate a new wallet seed. This needs to be done the first time the
   * app is started.
   * @return {Promise<undefined>}
   */
  async generateSeed() {
    const response = await this._grpc.sendUnlockerCommand('GenSeed');
    this._store.seedMnemonic = response.cipher_seed_mnemonic;
  }

  /**
   * Verify that the user has written down the generated seed correctly by
   * checking three random seed words. If the match continue to setting the
   * wallet password.
   * @return {undefined}
   */
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

  /**
   * Check the wallet password that was chosen by the user has the correct
   * length and that it was also entered correctly twice to make sure that
   * there was no typo.
   * @return {Promise<undefined>}
   */
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

  /**
   * Initiate the lnd wallet using the generated seed and password. If this
   * is success set `walletUnlocked` to true and navigate to the seed success
   * screen.
   * @param  {string} options.walletPassword The user chosen password
   * @param  {Array}  options.seedMnemonic   The seed words to generate the wallet
   * @return {Promise<undefined>}
   */
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

  /**
   * Check the password input by the user by attempting to unlock the wallet.
   * @return {Promise<undefined>}
   */
  async checkPassword() {
    const { password } = this._store.wallet;
    await this.unlockWallet({ walletPassword: password });
  }

  /**
   * Unlock the wallet by calling the grpc api with the user chosen password.
   * @param  {string} options.walletPassword The password used to encrypt the wallet
   * @return {Promise<undefined>}
   */
  async unlockWallet({ walletPassword }) {
    try {
      await this._grpc.sendUnlockerCommand('UnlockWallet', {
        wallet_password: toBuffer(walletPassword),
      });
      this._store.walletUnlocked = true;
      this._nav.goWait();
      observe(this._store, 'lndReady', () => this._nav.goHome());
    } catch (err) {
      this._notification.display({ type: 'error', msg: 'Invalid password' });
    }
  }

  /**
   * Toggle if fiat or btc should be use as the primary amount display in the
   * application. Aftwards save the user's current preference on disk.
   * @return {undefined}
   */
  toggleDisplayFiat() {
    this._store.settings.displayFiat = !this._store.settings.displayFiat;
    this._db.save();
  }

  /**
   * Fetch the on-chain wallet balances using the lnd grpc api and set the
   * corresponding values on the global store.
   * @return {Promise<undefined>}
   */
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

  /**
   * Fetch the lightning channel balances using the lnd grpc api and set the
   * corresponding values on the global store.
   * @return {Promise<undefined>}
   */
  async getChannelBalance() {
    try {
      const r = await this._grpc.sendCommand('ChannelBalance');
      this._store.channelBalanceSatoshis = parseSat(r.balance);
      this._store.pendingBalanceSatoshis = parseSat(r.pending_open_balance);
    } catch (err) {
      log.error('Getting channel balance failed', err);
    }
  }

  /**
   * Ensure that the wallet address is non-null before navigating to the
   * NewAddress view during onboarding.
   * This is necessary because the wallet address may be null if neutrino
   * has not started syncing by the time the user finishes verifying
   * their seed.
   * @return {undefined}
   */
  initInitialDeposit() {
    if (this._store.walletAddress) {
      this._nav.goNewAddress();
    } else {
      this._nav.goWait();
      when(
        () => typeof this._store.walletAddress === 'string',
        () => this._nav.goNewAddress()
      );
    }
  }

  /**
   * Fetch a new on-chain bitcoin address which can be used to fund the wallet
   * or receive an on-chain transaction from another user.
   * @return {Promise<undefined>}
   */
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

  /**
   * Poll for the current btc/fiat exchange rate based on the currently selected
   * fiat currency every 15 minutes.
   * @return {Promise<undefined>}
   */
  async pollExchangeRate() {
    await poll(() => this.getExchangeRate(), RATE_DELAY);
  }

  /**
   * Fetch a current btc/fiat exchange rate based on the currently selected
   * fiat currency and persist the value on disk for the next time the app
   * starts up.
   * @return {Promise<undefined>}
   */
  async getExchangeRate() {
    try {
      const fiat = this._store.settings.fiat;
      const uri = `https://blockchain.info/tobtc?currency=${fiat}&value=1`;
      const response = checkHttpStatus(await fetch(uri));
      this._store.settings.exchangeRate[fiat] = Number(await response.text());
      this._db.save();
    } catch (err) {
      log.error('Getting exchange rate failed', err);
    }
  }
}

export default WalletAction;
