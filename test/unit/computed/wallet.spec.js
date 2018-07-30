import { Store } from '../../../src/store';
import ComputedWallet from '../../../src/computed/wallet';

describe('Computed Wallet Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('ComputedWallet()', () => {
    it('should work with initial store', () => {
      ComputedWallet(store);
      expect(store.walletAddressUri, 'to equal', '');
      expect(store.depositLabel, 'to equal', '0');
      expect(store.channelBalanceLabel, 'to equal', '0');
      expect(store.unitFiatLabel, 'to equal', 'BTC');
      expect(store.unitLabel, 'to equal', 'BTC');
      expect(store.unit, 'to equal', 'BTC');
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
  });
});
