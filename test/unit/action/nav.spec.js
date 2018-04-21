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
    sandbox = sinon.sandbox.create();
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

  describe('goRequest()', () => {
    it('should set correct route and clear invoice', () => {
      nav.goRequest();
      expect(store.route, 'to equal', 'Request');
      expect(invoice.clear, 'was called once');
    });

    it('should set correct route and keep state', () => {
      nav.goRequest({ keepState: true });
      expect(store.route, 'to equal', 'Request');
      expect(invoice.clear, 'was not called');
    });
  });

  describe('goRequestQR()', () => {
    it('should set correct route and generate invoice uri', async () => {
      await nav.goRequestQR();
      expect(store.route, 'to equal', 'RequestQR');
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
