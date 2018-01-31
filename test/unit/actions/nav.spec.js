import { observable, useStrict } from 'mobx';
import * as log from '../../../src/actions/logs';
import ActionsNav from '../../../src/actions/nav';

describe('Actions Nav Unit Tests', () => {
  let store;
  let sandbox;
  let ipcRenderer;
  let actionsNav;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(log);
    ipcRenderer = {
      send: sinon.stub(),
      on: sinon.stub().yields('some-event', 'some-arg'),
    };
    useStrict(false);
    store = observable({ route: null });
    actionsNav = new ActionsNav(store, ipcRenderer);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should listen to open-url event', () => {
      expect(actionsNav._store, 'to be ok');
      expect(ipcRenderer.on, 'was called with', 'open-url');
    });
  });

  describe('goPay()', () => {
    it('should set correct route', () => {
      actionsNav.goPay();
      expect(store.route, 'to equal', 'Pay');
    });
  });

  describe('goRequest()', () => {
    it('should set correct route', () => {
      actionsNav.goRequest();
      expect(store.route, 'to equal', 'Request');
    });
  });

  describe('goChannels()', () => {
    it('should set correct route', () => {
      actionsNav.goChannels();
      expect(store.route, 'to equal', 'Channels');
    });
  });

  describe('goTransactions()', () => {
    it('should set correct route', () => {
      actionsNav.goTransactions();
      expect(store.route, 'to equal', 'Transactions');
    });
  });

  describe('goSettings()', () => {
    it('should set correct route', () => {
      actionsNav.goSettings();
      expect(store.route, 'to equal', 'Settings');
    });
  });

  describe('goCreateChannel()', () => {
    it('should set correct route', () => {
      actionsNav.goCreateChannel();
      expect(store.route, 'to equal', 'CreateChannel');
    });
  });

  describe('goInitializeWallet()', () => {
    it('should set correct route', () => {
      actionsNav.goInitializeWallet();
      expect(store.route, 'to equal', 'InitializeWallet');
    });
  });

  describe('goVerifyWallet()', () => {
    it('should set correct route', () => {
      actionsNav.goVerifyWallet();
      expect(store.route, 'to equal', 'VerifyWallet');
    });
  });
});
