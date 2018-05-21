import { Store } from '../../../src/store';
import * as log from '../../../src/action/log';
import NavAction from '../../../src/action/nav';

describe('Action Nav Unit Tests', () => {
  let store;
  let sandbox;
  let ipcRenderer;
  let nav;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(log);
    ipcRenderer = {
      send: sinon.stub(),
      on: sinon.stub().yields('some-event', 'some-arg'),
    };
    store = new Store();
    nav = new NavAction(store, ipcRenderer);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should listen to open-url event', () => {
      expect(nav._store, 'to be ok');
      expect(ipcRenderer.on, 'was called with', 'open-url');
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
      nav.goInvoiceQR();
      expect(store.route, 'to equal', 'InvoiceQR');
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

  describe.skip('goSettings()', () => {
    it('should set correct route', () => {
      nav.goSettings();
      expect(store.route, 'to equal', 'Settings');
    });
  });

  describe('goCreateChannel()', () => {
    it('should set correct route', () => {
      nav.goCreateChannel();
      expect(store.route, 'to equal', 'CreateChannel');
    });
  });

  describe('goInitializeWallet()', () => {
    it('should set correct route', () => {
      nav.goInitializeWallet();
      expect(store.route, 'to equal', 'InitializeWallet');
    });
  });

  describe('goVerifyWallet()', () => {
    it('should set correct route', () => {
      nav.goVerifyWallet();
      expect(store.route, 'to equal', 'VerifyWallet');
    });
  });
});
