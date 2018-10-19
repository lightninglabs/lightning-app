import { Store } from '../../../src/store';
import ComputedWallet from '../../../src/computed/wallet';
import { color } from '../../../src/component/style';

describe('Computed Wallet Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('ComputedWallet()', () => {
    it('should work with initial store', () => {
      ComputedWallet(store);
      expect(store.walletAddressUri, 'to equal', '');
      expect(store.depositLabel, 'to match', /0[,.]00/);
      expect(store.channelBalanceLabel, 'to match', /0[,.]00/);
      expect(store.unitFiatLabel, 'to equal', '$');
      expect(store.unitLabel, 'to equal', null);
      expect(store.newPasswordCopy, 'to equal', '');
      expect(store.newPasswordCheckColor, 'to equal', color.blackText);
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
      store.balanceSatoshis = 50000000;
      store.pendingBalanceSatoshis = 50000000;
      store.channelBalanceSatoshis = 10000;
      ComputedWallet(store);
      expect(store.depositLabel, 'to match', /6[,.]895[,.]13/);
      expect(store.channelBalanceLabel, 'to match', /0[,.]69/);
      expect(store.unitFiatLabel, 'to equal', '$');
      expect(store.unitLabel, 'to equal', null);
    });

    it('should display channel balance in sat', () => {
      store.settings.displayFiat = false;
      store.settings.exchangeRate.usd = 0.00014503;
      store.balanceSatoshis = 50000001;
      store.pendingBalanceSatoshis = 50000000;
      store.channelBalanceSatoshis = 10000;
      store.settings.unit = 'bit';
      ComputedWallet(store);
      expect(
        store.depositLabel,
        'to match',
        /^1{1}[,.]0{3}[,.]0{3}[,.]0{1}1{1}$/
      );
      expect(store.channelBalanceLabel, 'to equal', '100');
      expect(store.unitFiatLabel, 'to equal', 'bits');
      expect(store.unitLabel, 'to equal', 'bits');
    });

    it('should have red input if password is too short', () => {
      store.wallet.newPassword = '2short';
      ComputedWallet(store);
      expect(store.newPasswordCopy, 'to equal', '');
      expect(store.newPasswordCheckColor, 'to equal', color.red);
    });

    it('should display a tip if password could be improved', () => {
      store.wallet.newPassword = 'minlength';
      ComputedWallet(store);
      expect(store.newPasswordCopy, 'to match', /Pro tip/);
      expect(store.newPasswordCheckColor, 'to equal', color.green);
    });

    it('should display a positive message for a good password', () => {
      store.wallet.newPassword = 'at_least_12_chars';
      ComputedWallet(store);
      expect(store.newPasswordCopy, 'to match', /strong password/);
      expect(store.newPasswordCheckColor, 'to equal', color.green);
    });
  });
});
