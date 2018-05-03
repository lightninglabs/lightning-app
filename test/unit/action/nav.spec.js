import { Store } from '../../../src/store';
import * as log from '../../../src/action/log';
import NavAction from '../../../src/action/nav';
import InvoiceAction from '../../../src/action/invoice';

describe('Action Nav Unit Tests', () => {
  let store;
  let sandbox;
  let ipcRenderer;
  let invoice;
  let nav;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(log);
    ipcRenderer = {
      send: sinon.stub(),
      on: sinon.stub().yields('some-event', 'some-arg'),
    };
    store = new Store();
    invoice = sinon.createStubInstance(InvoiceAction);
    nav = new NavAction(store, invoice, ipcRenderer);
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

  describe('goInvoice()', () => {
    it('should set correct route and clear invoice', () => {
      nav.goInvoice();
      expect(store.route, 'to equal', 'Invoice');
      expect(invoice.clear, 'was called once');
    });

    it('should set correct route and keep state', () => {
      nav.goInvoice({ keepState: true });
      expect(store.route, 'to equal', 'Invoice');
      expect(invoice.clear, 'was not called');
    });
  });

  describe('goInvoiceQR()', () => {
    it('should set correct route and generate invoice uri', async () => {
      await nav.goInvoiceQR();
      expect(store.route, 'to equal', 'InvoiceQR');
      expect(invoice.generateUri, 'was called once');
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
