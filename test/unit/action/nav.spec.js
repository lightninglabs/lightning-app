import { Store } from '../../../src/store';
import * as log from '../../../src/action/log';
import NavAction from '../../../src/action/nav';

describe('Action Nav Unit Tests', () => {
  let store;
  let sandbox;
  let nav;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(log);
    store = new Store();
    nav = new NavAction(store);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('goLoader()', () => {
    it('should set correct route', () => {
      nav.goLoader();
      expect(store.route, 'to equal', 'Loader');
    });
  });

  describe('goSelectSeed()', () => {
    it('should set correct route', () => {
      nav.goSelectSeed();
      expect(store.route, 'to equal', 'SelectSeed');
    });
  });

  describe('goSeed()', () => {
    it('should set correct route', () => {
      nav.goSeed();
      expect(store.route, 'to equal', 'Seed');
    });
  });

  describe('goSeedVerify()', () => {
    it('should set correct route', () => {
      nav.goSeedVerify();
      expect(store.route, 'to equal', 'SeedVerify');
    });
  });

  describe.skip('goRestoreWallet()', () => {
    it('should set correct route', () => {
      nav.goRestoreWallet();
      expect(store.route, 'to equal', 'RestoreWallet');
    });
  });

  describe('goSeedSuccess()', () => {
    it('should set correct route', () => {
      nav.goSeedSuccess();
      expect(store.route, 'to equal', 'SeedSuccess');
    });
  });

  describe('goSetPassword()', () => {
    it('should set correct route', () => {
      nav.goSetPassword();
      expect(store.route, 'to equal', 'SetPassword');
    });
  });

  describe('goPassword()', () => {
    it('should set correct route', () => {
      nav.goPassword();
      expect(store.route, 'to equal', 'Password');
    });
  });

  describe('goNewAddress()', () => {
    it('should set correct route', () => {
      nav.goNewAddress();
      expect(store.route, 'to equal', 'NewAddress');
    });
  });

  describe('goLoaderSyncing()', () => {
    it('should set correct route', () => {
      nav.goLoaderSyncing();
      expect(store.route, 'to equal', 'LoaderSyncing');
    });
  });

  describe('goWait()', () => {
    it('should set correct route', () => {
      nav.goWait();
      expect(store.route, 'to equal', 'Wait');
    });
  });

  describe('goHome()', () => {
    it('should set correct route', () => {
      nav.goHome();
      expect(store.route, 'to equal', 'Home');
    });
  });

  describe('goPay()', () => {
    it('should set correct route', () => {
      nav.goPay();
      expect(store.route, 'to equal', 'Pay');
    });
  });

  describe('goPayLightningConfirm()', () => {
    it('should set correct route', () => {
      nav.goPayLightningConfirm();
      expect(store.route, 'to equal', 'PayLightningConfirm');
    });
  });

  describe('goPayLightningDone()', () => {
    it('should set correct route', () => {
      nav.goPayLightningDone();
      expect(store.route, 'to equal', 'PayLightningDone');
    });
  });

  describe('goPayBitcoin()', () => {
    it('should set correct route', () => {
      nav.goPayBitcoin();
      expect(store.route, 'to equal', 'PayBitcoin');
    });
  });

  describe('goPayBitcoinConfirm()', () => {
    it('should set correct route', () => {
      nav.goPayBitcoinConfirm();
      expect(store.route, 'to equal', 'PayBitcoinConfirm');
    });
  });

  describe('goPayBitcoinDone()', () => {
    it('should set correct route', () => {
      nav.goPayBitcoinDone();
      expect(store.route, 'to equal', 'PayBitcoinDone');
    });
  });

  describe('goInvoice()', () => {
    it('should set correct route', () => {
      nav.goInvoice();
      expect(store.route, 'to equal', 'Invoice');
    });
  });

  describe('goInvoiceQR()', () => {
    it('should set correct route', () => {
      store.displayCopied = true;
      nav.goInvoiceQR();
      expect(store.route, 'to equal', 'InvoiceQR');
      expect(store.displayCopied, 'to be', false);
    });
  });

  describe('goChannels()', () => {
    it('should set correct route', () => {
      nav.goChannels();
      expect(store.route, 'to equal', 'Channels');
    });
  });

  describe('goChannelDetail()', () => {
    it('should set correct route', () => {
      nav.goChannelDetail();
      expect(store.route, 'to equal', 'ChannelDetail');
    });
  });

  describe('goChannelDelete()', () => {
    it('should set correct route', () => {
      nav.goChannelDelete();
      expect(store.route, 'to equal', 'ChannelDelete');
    });
  });

  describe('goTransactions()', () => {
    it('should set correct route', () => {
      nav.goTransactions();
      expect(store.route, 'to equal', 'Transactions');
    });
  });

  describe('goTransactionDetail()', () => {
    it('should set correct route', () => {
      nav.goTransactionDetail();
      expect(store.route, 'to equal', 'TransactionDetail');
    });
  });

  describe('goNotifications()', () => {
    it('should set correct route', () => {
      nav.goNotifications();
      expect(store.route, 'to equal', 'Notifications');
    });
  });

  describe('goSettings()', () => {
    it('should set correct route', () => {
      nav.goSettings();
      expect(store.route, 'to equal', 'Settings');
    });
  });

  describe('goSettingsUnit()', () => {
    it('should set correct route', () => {
      nav.goSettingsUnit();
      expect(store.route, 'to equal', 'SettingsUnit');
    });
  });

  describe('goSettingsFiat()', () => {
    it('should set correct route', () => {
      nav.goSettingsFiat();
      expect(store.route, 'to equal', 'SettingsFiat');
    });
  });

  describe('goCLI()', () => {
    it('should set correct route', () => {
      nav.goCLI();
      expect(store.route, 'to equal', 'CLI');
    });
  });

  describe('goCreateChannel()', () => {
    it('should set correct route', () => {
      nav.goCreateChannel();
      expect(store.route, 'to equal', 'CreateChannel');
    });
  });

  describe('goDeposit()', () => {
    it('should set correct route', () => {
      store.displayCopied = true;
      nav.goDeposit();
      expect(store.route, 'to equal', 'Deposit');
      expect(store.displayCopied, 'to be', false);
    });
  });
});
