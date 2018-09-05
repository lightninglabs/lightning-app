/**
 * @fileOverview actions for wrap navigation between views behing a platform
 * independant api. These action should be pretty dumb and only change the
 * route to be rendered in the user interface.
 */

class NavAction {
  constructor(store) {
    this._store = store;
  }

  goLoader() {
    this._store.route = 'Loader';
  }

  goSelectSeed() {
    this._store.route = 'SelectSeed';
  }

  goSeed() {
    this._store.route = 'Seed';
  }

  goSeedVerify() {
    this._store.route = 'SeedVerify';
  }

  goRestoreWallet() {
    // this._store.route = 'RestoreWallet';
  }

  goSeedSuccess() {
    this._store.route = 'SeedSuccess';
  }

  goSetPassword() {
    this._store.route = 'SetPassword';
  }

  goPassword() {
    this._store.route = 'Password';
  }

  goNewAddress() {
    this._store.route = 'NewAddress';
  }

  goLoaderSyncing() {
    this._store.route = 'LoaderSyncing';
  }

  goWait() {
    this._store.route = 'Wait';
  }

  goHome() {
    this._store.route = 'Home';
  }

  goPay() {
    this._store.route = 'Pay';
  }

  goPayLightningConfirm() {
    this._store.route = 'PayLightningConfirm';
  }

  goPayLightningDone() {
    this._store.route = 'PayLightningDone';
  }

  goPayBitcoin() {
    this._store.route = 'PayBitcoin';
  }

  goPayBitcoinConfirm() {
    this._store.route = 'PayBitcoinConfirm';
  }

  goPayBitcoinDone() {
    this._store.route = 'PayBitcoinDone';
  }

  goInvoice() {
    this._store.route = 'Invoice';
  }

  goInvoiceQR() {
    this._store.displayCopied = false;
    this._store.route = 'InvoiceQR';
  }

  goChannels() {
    this._store.route = 'Channels';
  }

  goChannelDetail() {
    this._store.route = 'ChannelDetail';
  }

  goChannelDelete() {
    this._store.route = 'ChannelDelete';
  }

  goChannelCreate() {
    this._store.route = 'ChannelCreate';
  }

  goTransactions() {
    this._store.route = 'Transactions';
  }

  goTransactionDetail() {
    this._store.route = 'TransactionDetail';
  }

  goNotifications() {
    this._store.route = 'Notifications';
  }

  goSettings() {
    this._store.route = 'Settings';
  }

  goSettingsUnit() {
    this._store.route = 'SettingsUnit';
  }

  goSettingsFiat() {
    this._store.route = 'SettingsFiat';
  }

  goCLI() {
    this._store.route = 'CLI';
  }

  goCreateChannel() {
    this._store.route = 'CreateChannel';
  }

  goDeposit() {
    this._store.displayCopied = false;
    this._store.route = 'Deposit';
  }
}

export default NavAction;
