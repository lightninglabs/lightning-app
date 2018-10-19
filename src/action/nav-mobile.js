/**
 * @fileOverview actions that wrap navigation for mobile between views
 * behing a platform independant api. These actions should be pretty dumb
 * and only change the route to be rendered in the user interface.
 */

import { NavigationActions } from 'react-navigation';

class NavAction {
  constructor(store) {
    this._store = store;
  }

  setTopLevelNavigator(navigatorRef) {
    this._navigate = (routeName, params) =>
      navigatorRef.dispatch(NavigationActions.navigate({ routeName, params }));
  }

  goLoader() {
    this._navigate('Loader');
  }

  goSelectSeed() {
    this._navigate('SelectSeed');
  }

  goSeed() {
    this._navigate('Seed');
  }

  goSeedVerify() {
    this._navigate('SeedVerify');
  }

  goRestoreSeed() {
    this._navigate('RestoreSeed');
  }

  goRestorePassword() {
    this._navigate('RestorePassword');
  }

  goSeedSuccess() {
    this._navigate('SeedSuccess');
  }

  goSetPassword() {
    this._navigate('SetPassword');
  }

  goPassword() {
    this._navigate('Password');
  }

  goNewAddress() {
    this._navigate('NewAddress');
  }

  goLoaderSyncing() {
    this._navigate('LoaderSyncing');
  }

  goWait() {
    this._navigate('Wait');
  }

  goHome() {
    this._navigate('Home');
  }

  goPay() {
    this._navigate('Pay');
  }

  goPayLightningConfirm() {
    this._navigate('PayLightningConfirm');
  }

  goPayLightningDone() {
    this._navigate('PayLightningDone');
  }

  goPaymentFailed() {
    this._navigate('PaymentFailed');
  }

  goPayBitcoin() {
    this._navigate('PayBitcoin');
  }

  goPayBitcoinConfirm() {
    this._navigate('PayBitcoinConfirm');
  }

  goPayBitcoinDone() {
    this._navigate('PayBitcoinDone');
  }

  goInvoice() {
    this._navigate('Invoice');
  }

  goInvoiceQR() {
    this._store.displayCopied = false;
    this._navigate('InvoiceQR');
  }

  goChannels() {
    this._navigate('Channels');
  }

  goChannelDetail() {
    this._navigate('ChannelDetail');
  }

  goChannelDelete() {
    this._navigate('ChannelDelete');
  }

  goChannelCreate() {
    this._navigate('ChannelCreate');
  }

  goTransactions() {
    this._navigate('Transactions');
  }

  goTransactionDetail() {
    this._navigate('TransactionDetail');
  }

  goNotifications() {
    this._navigate('Notifications');
  }

  goSettings() {
    this._navigate('Settings');
  }

  goSettingsUnit() {
    this._navigate('SettingsUnit');
  }

  goSettingsFiat() {
    this._navigate('SettingsFiat');
  }

  goCLI() {
    this._navigate('CLI');
  }

  goCreateChannel() {
    this._navigate('CreateChannel');
  }

  goDeposit() {
    this._store.displayCopied = false;
    this._navigate('Deposit');
  }
}

export default NavAction;
