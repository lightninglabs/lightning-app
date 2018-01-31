import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import * as logger from '../../../src/actions/logs';

describe('Actions GRPC Unit Tests', () => {
  let store;
  let remote;
  let client;
  let serverReady;
  let actionsGrpc;
  let sandbox;
  let origMacaroonsEnabled;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    origMacaroonsEnabled = require('../../../src/config').MACAROONS_ENABLED;
    useStrict(false);
    store = observable({ lndReady: false });
    remote = { getGlobal: sinon.stub() };
    client = { listPeers: sinon.stub() };
    serverReady = sinon.stub().yields();
    remote.getGlobal.withArgs('serverReady').returns(serverReady);
    remote.getGlobal.withArgs('connection').returns(client);
    remote.getGlobal.withArgs('metadata').returns('some-metadata');
    actionsGrpc = new ActionsGrpc(store, remote);
  });

  afterEach(() => {
    sandbox.restore();
    require('../../../src/config').MACAROONS_ENABLED = origMacaroonsEnabled;
  });

  describe('constructor()', () => {
    it('should setup client and set lndReady to true', () => {
      expect(actionsGrpc._store.lndReady, 'to be true');
      expect(actionsGrpc.client, 'to be ok');
      expect(actionsGrpc.metadata, 'to be undefined');
    });

    it('should set matadata if MACAROONS_ENABLED', () => {
      require('../../../src/config').MACAROONS_ENABLED = true;
      actionsGrpc = new ActionsGrpc(store, remote);
      expect(actionsGrpc._store.lndReady, 'to be true');
      expect(actionsGrpc.client, 'to be ok');
      expect(actionsGrpc.metadata, 'to equal', 'some-metadata');
    });

    it('should not set lndReady if serverReady fails', () => {
      serverReady.yields(new Error('Boom!'));
      store = observable({ lndReady: false });
      actionsGrpc = new ActionsGrpc(store, remote);
      expect(actionsGrpc._store.lndReady, 'to be false');
      expect(actionsGrpc.client, 'to be ok');
      expect(actionsGrpc.metadata, 'to be undefined');
    });
  });

  describe('sendCommand()', () => {
    it('should fail if lndReady is false', async () => {
      store.lndReady = false;
      return expect(
        actionsGrpc.sendCommand('listPeers'),
        'to be rejected with error satisfying',
        /still starting/
      );
    });

    it('should fail if client is not set', async () => {
      actionsGrpc.client = null;
      return expect(
        actionsGrpc.sendCommand('listPeers'),
        'to be rejected with error satisfying',
        /not connect/
      );
    });

    it('should fail for invalid rpc method', async () => {
      return expect(
        actionsGrpc.sendCommand('foobar'),
        'to be rejected with error satisfying',
        /method/
      );
    });

    it('should handle error response', async () => {
      client.listPeers.yields(new Error('Boom!'));
      return expect(
        actionsGrpc.sendCommand('listPeers'),
        'to be rejected with error satisfying',
        /Boom!/
      );
    });

    it('should handle successful response', async () => {
      client.listPeers.yields(null, 'some-response');
      const response = await actionsGrpc.sendCommand('listPeers', 'payload');
      expect(response, 'to equal', 'some-response');
    });

    it('should handle successful response with MACAROONS_ENABLED', async () => {
      require('../../../src/config').MACAROONS_ENABLED = true;
      actionsGrpc = new ActionsGrpc(store, remote);
      client.listPeers.yields(null, 'some-response');
      const response = await actionsGrpc.sendCommand('listPeers', 'payload');
      expect(response, 'to equal', 'some-response');
      expect(client.listPeers, 'was called with', 'payload', 'some-metadata');
    });
  });

  describe('sendStreamCommand()', () => {
    it('should fail if lndReady is false', async () => {
      store.lndReady = false;
      return expect(
        actionsGrpc.sendStreamCommand('listPeers'),
        'to be rejected with error satisfying',
        /still starting/
      );
    });

    it('should fail if client is not set', async () => {
      actionsGrpc.client = null;
      return expect(
        actionsGrpc.sendStreamCommand('listPeers'),
        'to be rejected with error satisfying',
        /not connect/
      );
    });

    it('should fail for invalid rpc method', async () => {
      return expect(
        actionsGrpc.sendStreamCommand('foobar'),
        'to be rejected with error satisfying',
        /method/
      );
    });

    it('should handle error response', async () => {
      client.listPeers.throws(new Error('Boom!'));
      return expect(
        actionsGrpc.sendStreamCommand('listPeers'),
        'to be rejected with error satisfying',
        /Boom!/
      );
    });

    it('should handle successful response', async () => {
      client.listPeers.returns('some-response');
      const response = await actionsGrpc.sendStreamCommand(
        'listPeers',
        'payload'
      );
      expect(response, 'to equal', 'some-response');
    });

    it('should handle successful response with MACAROONS_ENABLED', async () => {
      require('../../../src/config').MACAROONS_ENABLED = true;
      actionsGrpc = new ActionsGrpc(store, remote);
      client.listPeers.returns('some-response');
      const response = await actionsGrpc.sendStreamCommand(
        'listPeers',
        'payload'
      );
      expect(response, 'to equal', 'some-response');
      expect(client.listPeers, 'was called with', 'some-metadata', {
        body: 'payload',
      });
    });
  });
});
