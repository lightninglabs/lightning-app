/**
 * @fileOverview actions to set wallet state within the app and to
 * call the corresponding GRPC apis for updating wallet balances.
 */

import { toBuffer, parseSat, checkHttpStatus, nap, poll } from '../helper';
import {
  MIN_PASSWORD_LENGTH,
  NOTIFICATION_DELAY,
  RATE_DELAY,
  RECOVERY_WINDOW,
  PIN_LENGTH,
} from '../config';
import { when } from 'mobx';
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

  /**
   * Set the restore seed input by the seed word and
   * seed index.
   * @param {string} options.word  The seed word
   * @param {number} options.index The seed index
   */
  setRestoreSeed({ word, index }) {
    this._store.wallet.restoreSeed[index] = word;
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
    this._store.wallet.newPassword = '';
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
   * Initialize the reset password user flow by resetting input values
   * and then navigating to the initial view.
   * @return {undefined}
   */
  initResetPassword() {
    this._store.wallet.password = '';
    this._store.wallet.passwordVerify = '';
    this._store.wallet.newPassword = '';
    this._nav.goResetPasswordCurrent();
  }

  /**
   * Set the password input for the password view.
   * @param {string} options.password The wallet password
   */
  setPassword({ password }) {
    this._store.wallet.password = password;
  }

  /**
   * Set the new password input for the reset password: new password view.
   * @param {string} options.password The wallet password
   */
  setNewPassword({ password }) {
    this._store.wallet.newPassword = password;
  }

  /**
   * Set the verify password input for the password view.
   * @param {string} options.password The wallet password a second time
   */
  setPasswordVerify({ password }) {
    this._store.wallet.passwordVerify = password;
  }

  /**
   * Append a digit input to the password parameter.
   * @param  {string} options.digit The digit to append to the password
   * @param  {string} options.param The password parameter name
   * @return {undefined}
   */
  pushPinDigit({ digit, param }) {
    const { wallet } = this._store;
    if (wallet[param].length < PIN_LENGTH) {
      wallet[param] += digit;
    }
    if (wallet[param].length < PIN_LENGTH) {
      return;
    }
    if (param === 'newPassword') {
      this._nav.goSetPasswordConfirm();
    } else if (param === 'passwordVerify') {
      this.checkNewPassword(PIN_LENGTH);
    } else if (param === 'password') {
      this.checkPassword();
    }
  }

  /**
   * Remove the last digit from the password parameter.
   * @param  {string} options.param The password parameter name
   * @return {undefined}
   */
  popPinDigit({ param }) {
    const { wallet } = this._store;
    if (wallet[param]) {
      wallet[param] = wallet[param].slice(0, -1);
    } else if (param === 'passwordVerify') {
      this.initSetPassword();
    }
  }

  /**
   * Set whether or not we're restoring the wallet.
   * @param {boolean} options.restoring Whether or not we're restoring.
   */
  setRestoringWallet({ restoring }) {
    this._store.wallet.restoring = restoring;
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
      this._nav.goSelectSeed();
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
  async checkNewPassword(minLength = MIN_PASSWORD_LENGTH) {
    const { newPassword, passwordVerify } = this._store.wallet;
    let errorMsg;
    if (!newPassword || newPassword.length < minLength) {
      errorMsg = `Set a password with at least ${minLength} characters.`;
    } else if (newPassword !== passwordVerify) {
      errorMsg = 'Passwords do not match!';
    }
    if (errorMsg) {
      this.initSetPassword();
      return this._notification.display({ msg: errorMsg });
    }
    await this.initWallet({
      walletPassword: newPassword,
      seedMnemonic: this._store.seedMnemonic.toJSON(),
    });
  }

  /**
   * Check the wallet password that was chosen by the user has the correct
   * length and that it was also entered correctly twice to make sure that
   * there was no typo.
   * @return {Promise<undefined>}
   */
  async checkResetPassword() {
    const { password, newPassword, passwordVerify } = this._store.wallet;
    let errorMsg;
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      errorMsg = `Set a password with at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (newPassword === password) {
      errorMsg = 'New password must not match old password.';
    } else if (newPassword !== passwordVerify) {
      errorMsg = 'Passwords do not match!';
    }
    if (errorMsg) {
      this.initResetPassword();
      return this._notification.display({ msg: errorMsg });
    }
    this._nav.goWait();
    await this.resetPassword({
      currentPassword: password,
      newPassword: newPassword,
    });
  }

  /**
   * Initiate the lnd wallet using the generated seed and password. If this
   * is success set `walletUnlocked` to true and navigate to the seed success
   * screen.
   * @param  {string} options.walletPassword The user chosen password
   * @param  {Array}  options.seedMnemonic   The seed words to generate the wallet
   * @param  {number} options.recoveryWindow The number of addresses to recover
   * @return {Promise<undefined>}
   */
  async initWallet({ walletPassword, seedMnemonic, recoveryWindow = 0 }) {
    try {
      await this._grpc.sendUnlockerCommand('InitWallet', {
        wallet_password: toBuffer(walletPassword),
        cipher_seed_mnemonic: seedMnemonic,
        recovery_window: recoveryWindow,
      });
      this._store.walletUnlocked = true;
      this._nav.goSeedSuccess();
    } catch (err) {
      this._notification.display({
        type: 'error',
        msg: `Initializing wallet failed: ${err.details}`,
      });
    }
  }

  /**
   * Initialize the restore wallet view by resetting input values and then
   * navigating to the view.
   * @return {undefined}
   */
  initRestoreWallet() {
    this._store.wallet.restoreIndex = 0;
    this._nav.goRestoreSeed();
  }

  /**
   * Initialize the next restore wallet view by setting a new restoreIndex or,
   * if all seed words have been entered, navigating to the password entry
   * view.
   * @return {undefined}
   */
  initNextRestorePage() {
    if (this._store.wallet.restoreIndex < 21) {
      this._store.wallet.restoreIndex += 3;
    } else {
      this._nav.goRestorePassword();
    }
  }

  /**
   * Initialize the previous restore wallet view by setting a new restoreIndex
   * or, if on the first seed entry page, navigating to the select seed view.
   * @return {undefined}
   */
  initPrevRestorePage() {
    if (this._store.wallet.restoreIndex >= 3) {
      this._store.wallet.restoreIndex -= 3;
    } else {
      this._nav.goSelectSeed();
    }
  }

  /**
   * Update the current wallet password of the user.
   * @param  {string} options.currentPassword The current password of the user.
   * @param  {string} options.newPassword     The new password of the user.
   * @return {Promise<undefined>}
   */
  async resetPassword({ currentPassword, newPassword }) {
    try {
      await this._grpc.restartLnd();
      this._store.walletUnlocked = false;
      this._store.lndReady = false;
      await this._grpc.initUnlocker();
      await this._grpc.sendUnlockerCommand('ChangePassword', {
        current_password: toBuffer(currentPassword),
        new_password: toBuffer(newPassword),
      });
      this._store.walletUnlocked = true;
      this._nav.goResetPasswordSaved();
    } catch (err) {
      this._notification.display({ msg: 'Password change failed', err });
      this._nav.goResetPasswordCurrent();
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
   * Initialize the wallet with the password input the seed that was already
   * inputted, and the default recovery window.
   * @return {Promise<undefined>}
   */
  async restoreWallet() {
    const { password, restoreSeed } = this._store.wallet;
    await this.initWallet({
      walletPassword: password,
      seedMnemonic: restoreSeed.toJSON(),
      recoveryWindow: RECOVERY_WINDOW,
    });
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
      when(() => this._store.lndReady, () => this._nav.goHome());
    } catch (err) {
      this.setPassword({ password: '' });
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
