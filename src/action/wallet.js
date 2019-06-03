/**
 * @fileOverview actions to set wallet state within the app and to
 * call the corresponding GRPC apis for updating wallet balances.
 */

import { toBuffer, checkHttpStatus, nap, poll } from '../helper';
import {
  MIN_PASSWORD_LENGTH,
  NOTIFICATION_DELAY,
  RATE_DELAY,
  RECOVERY_WINDOW,
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
    this._store.seedMnemonic[index] = word.trim();
  }

  /**
   * Set which seed restore input is in focus.
   * @param {number} options.index The index of the input.
   */
  setFocusedRestoreInd({ index }) {
    this._store.wallet.focusedRestoreInd = index;
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
    await Promise.all([
      this.getBalance(),
      this.getChannelBalance(),
      this.getNewAddress(),
    ]);
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
    this._store.seedMnemonic = response.cipherSeedMnemonic;
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
    const { newPassword, passwordVerify } = this._store.wallet;
    let errorMsg;
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      errorMsg = `Set a password with at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (newPassword !== passwordVerify) {
      errorMsg = 'Passwords do not match!';
    }
    if (errorMsg) {
      this.initSetPassword();
      return this._notification.display({ msg: errorMsg });
    }
    await this.initWallet({
      walletPassword: newPassword,
      recoveryWindow: this._store.settings.restoring ? RECOVERY_WINDOW : 0,
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
        walletPassword: toBuffer(walletPassword),
        cipherSeedMnemonic: seedMnemonic,
        recoveryWindow: recoveryWindow,
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
   * Initialize the seed flow by navigating to the proper next view and
   * resetting the current seed index.
   * @return {undefined}
   */
  initSeed() {
    this._store.wallet.seedIndex = 0;
    this._nav.goSeedIntro ? this._nav.goSeedIntro() : this._nav.goSeed();
  }

  /**
   * Initialize the next seed view by setting a new seedIndex or, if all seed
   * words have been displayed, navigating to the mobile seed verify view.
   * @return {undefined}
   */
  initNextSeedPage() {
    if (this._store.wallet.seedIndex < 16) {
      this._store.wallet.seedIndex += 8;
    } else {
      this.initSeedVerify();
    }
  }

  /**
   * Initialize the previous seed view by setting a new seedIndex or, if on the
   * first seed page, navigating to the select seed view.
   * @return {undefined}
   */
  initPrevSeedPage() {
    if (this._store.wallet.seedIndex >= 8) {
      this._store.wallet.seedIndex -= 8;
    } else {
      this._nav.goSelectSeed();
    }
  }

  /**
   * Initialize the restore wallet view by resetting input values and then
   * navigating to the view.
   * @return {undefined}
   */
  initRestoreWallet() {
    this._store.seedMnemonic = Array(24).fill('');
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
      this._store.wallet.focusedRestoreInd = this._store.wallet.restoreIndex;
    } else {
      this.initSetPassword();
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
      this._store.wallet.focusedRestoreInd = this._store.wallet.restoreIndex;
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
        currentPassword: toBuffer(currentPassword),
        newPassword: toBuffer(newPassword),
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
   * Unlock the wallet by calling the grpc api with the user chosen password.
   * @param  {string} options.walletPassword The password used to encrypt the wallet
   * @return {Promise<undefined>}
   */
  async unlockWallet({ walletPassword }) {
    try {
      this._nav.goWait();
      await this._grpc.sendUnlockerCommand('UnlockWallet', {
        walletPassword: toBuffer(walletPassword),
        recoveryWindow: this._store.settings.restoring ? 250 : 0,
      });
      this._store.walletUnlocked = true;
      when(
        () => this._store.lndReady && this._store.walletAddress,
        () => this._nav.goHome()
      );
    } catch (err) {
      this.initPassword();
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
      this._store.balanceSatoshis = r.totalBalance;
      this._store.confirmedBalanceSatoshis = r.confirmedBalance;
      this._store.unconfirmedBalanceSatoshis = r.unconfirmedBalance;
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
      this._store.channelBalanceSatoshis = r.balance;
      this._store.pendingBalanceSatoshis = r.pendingOpenBalance;
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
      when(() => this._store.walletAddress, () => this._nav.goNewAddress());
    }
  }

  /**
   * Fetch a new on-chain bitcoin address which can be used to fund the wallet
   * or receive an on-chain transaction from another user.
   * @return {Promise<undefined>}
   */
  async getNewAddress() {
    try {
      const { address } = await this._grpc.sendCommand('NewAddress', {
        type: 3, // UNUSED_NESTED_PUBKEY_HASH = 3
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
      const uri =
        'https://nodes.lightning.computer/fiat/v1/btc-exchange-rates.json';
      const response = checkHttpStatus(await fetch(uri));
      const tickers = (await response.json()).tickers;
      const rate = tickers.find(t => t.ticker.toLowerCase() === fiat).rate;
      this._store.settings.exchangeRate[fiat] = 100 / rate;
      this._db.save();
    } catch (err) {
      log.error('Getting exchange rate failed', err);
    }
  }
}

export default WalletAction;
