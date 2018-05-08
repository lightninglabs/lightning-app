import { observable, useStrict } from 'mobx';
import ComputedWallet from '../../../src/computed/wallet';
import { DEFAULT_UNIT, DEFAULT_FIAT } from '../../../src/config';

describe('Computed Wallet Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      settings: {
        unit: DEFAULT_UNIT,
        fiat: DEFAULT_FIAT,
        displayFiat: false,
        exchangeRate: {
          usd: null,
          eur: null,
        },
      },
    });
  });

  describe('ComputedWallet()', () => {
    it('should work with initial store', () => {
      ComputedWallet(store);
      expect(store.walletAddressUri, 'to equal', '');
      expect(store.balanceLabel, 'to equal', '0');
      expect(store.channelBalanceLabel, 'to equal', '0');
      expect(store.unitLabel, 'to equal', 'BTC');
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
      store.balanceSatoshis = 100000000;
      store.channelBalanceSatoshis = 10000;
      ComputedWallet(store);
      expect(store.balanceLabel, 'to match', /6[,.]895[,.]13/);
      expect(store.channelBalanceLabel, 'to match', /0[,.]69/);
      expect(store.unitLabel, 'to equal', null);
    });

    it('should display channel balance in sat', () => {
      store.settings.exchangeRate.usd = 0.00014503;
      store.balanceSatoshis = 100000001;
      store.channelBalanceSatoshis = 10000;
      store.settings.unit = 'bit';
      ComputedWallet(store);
      expect(
        store.balanceLabel,
        'to match',
        /^1{1}[,.]0{3}[,.]0{3}[,.]0{1}1{1}$/
      );
      expect(store.channelBalanceLabel, 'to equal', '100');
      expect(store.unitLabel, 'to equal', 'bits');
    });
  });
});
