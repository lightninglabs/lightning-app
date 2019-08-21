import { Store } from '../../../src/store';
import ComputedWallet from '../../../src/computed/wallet';

describe('Computed Wallet Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('ComputedWallet()', () => {
    it('should work with initial store', () => {
      store.settings.displayFiat = true;
      store.channelBalancePendingSatoshis = 0;
      store.channelBalanceOpenSatoshis = 0;
      store.channelBalanceInactiveSatoshis = 0;
      store.channelBalanceClosingSatoshis = 0;
      ComputedWallet(store);
      expect(store.walletAddressUri, 'to equal', '');
      expect(store.balanceLabel, 'to match', /0[,.]00/);
      expect(store.totalBalanceSatoshis, 'to equal', 0);
      expect(store.totalBalanceLabel, 'to match', /0[,.]00/);
      expect(store.unitFiatLabel, 'to equal', '$');
      expect(store.unitLabel, 'to equal', null);
      expect(store.newPasswordCopy, 'to equal', '');
      expect(store.newPasswordSuccess, 'to equal', null);
      expect(store.channelPercentageLabel, 'to equal', '0% on Lightning');
    });

    it('should generate valid wallet address uri', () => {
      store.walletAddress = 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K';
      ComputedWallet(store);
      expect(
        store.walletAddressUri,
        'to equal',
        'bitcoin:ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K'
      );
    });

    it('should display channel balance in usd', () => {
      store.settings.displayFiat = true;
      store.settings.exchangeRate.usd = 0.00014503;
      store.confirmedBalanceSatoshis = 50000000;
      store.channelBalancePendingSatoshis = 50000000;
      store.channelBalanceOpenSatoshis = 5000;
      store.channelBalanceInactiveSatoshis = 5000;
      store.channelBalanceClosingSatoshis = 100;
      ComputedWallet(store);
      expect(store.balanceLabel, 'to match', /3[,.]447[,.]56/);
      expect(store.totalBalanceSatoshis, 'to equal', 100010100);
      expect(store.totalBalanceLabel, 'to match', /6[,.]895[,.]82/);
      expect(store.unitFiatLabel, 'to equal', '$');
      expect(store.unitLabel, 'to equal', null);
      expect(store.channelPercentageLabel, 'to equal', '50% on Lightning');
    });

    it('should display channel balance in sat', () => {
      store.settings.displayFiat = false;
      store.settings.exchangeRate.usd = 0.00014503;
      store.confirmedBalanceSatoshis = 50000001;
      store.channelBalancePendingSatoshis = 50000000;
      store.channelBalanceOpenSatoshis = 5000;
      store.channelBalanceInactiveSatoshis = 5000;
      store.channelBalanceClosingSatoshis = 100;
      store.settings.unit = 'bit';
      ComputedWallet(store);
      expect(store.balanceLabel, 'to match', /500[,.]000[,.]01/);
      expect(store.totalBalanceSatoshis, 'to equal', 100010101);
      expect(store.totalBalanceLabel, 'to match', /1[,.]000[,.]101[,.]01/);
      expect(store.unitFiatLabel, 'to equal', 'bits');
      expect(store.unitLabel, 'to equal', 'bits');
    });

    it('should have red input if password is too short', () => {
      store.wallet.newPassword = '2short';
      ComputedWallet(store);
      expect(store.newPasswordCopy, 'to equal', '');
      expect(store.newPasswordSuccess, 'to equal', false);
    });

    it('should display a tip if password could be improved', () => {
      store.wallet.newPassword = 'minlength';
      ComputedWallet(store);
      expect(store.newPasswordCopy, 'to match', /Pro tip/);
      expect(store.newPasswordSuccess, 'to equal', true);
    });

    it('should display a positive message for a good password', () => {
      store.wallet.newPassword = 'at_least_12_chars';
      ComputedWallet(store);
      expect(store.newPasswordCopy, 'to match', /strong password/);
      expect(store.newPasswordSuccess, 'to equal', true);
    });
  });
});
