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

  describe('goPayLighting()', () => {
    it('should set correct route', () => {
      nav.goPayLighting();
      expect(store.route, 'to equal', 'PayLighting');
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

  describe('goTransactions()', () => {
    it('should set correct route', () => {
      nav.goTransactions();
      expect(store.route, 'to equal', 'Transactions');
    });
  });

  describe('goSettings()', () => {
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
