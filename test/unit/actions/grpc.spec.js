import { Store } from '../../../src/store';
import ActionsGrpc from '../../../src/actions/grpc';
import * as logger from '../../../src/actions/logs';

describe('Actions GRPC Unit Tests', () => {
  let store;
  let actionsGrpc;
  let sandbox;
  let ipcRendererStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    store = new Store();
    ipcRendererStub = {
      on: sandbox.stub(),
      once: sandbox.stub(),
      send: sandbox.stub(),
    };
    actionsGrpc = new ActionsGrpc(store, ipcRendererStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initUnlocker()', () => {
    it('should set unlockerReady', async () => {
      sandbox.stub(actionsGrpc, '_sendIpc').resolves();
      await actionsGrpc.initUnlocker();
      expect(store.unlockerReady, 'to be', true);
    });
  });

  describe('sendUnlockerCommand()', () => {
    it('should send ipc with correct args', async () => {
      sandbox.stub(actionsGrpc, '_sendIpc').resolves();
      await actionsGrpc.sendUnlockerCommand('some-method', 'some-body');
      expect(
        actionsGrpc._sendIpc,
        'was called with',
        'unlockRequest',
        'unlockResponse',
        'some-method',
        'some-body'
      );
    });
  });

  describe('initLnd()', () => {
    it('should set lndReady', async () => {
      sandbox.stub(actionsGrpc, '_sendIpc').resolves();
      await actionsGrpc.initLnd();
      expect(store.lndReady, 'to be', true);
    });
  });

  describe('sendCommand()', () => {
    it('should send ipc with correct args', async () => {
      sandbox.stub(actionsGrpc, '_sendIpc').resolves();
      await actionsGrpc.sendCommand('some-method', 'some-body');
      expect(
        actionsGrpc._sendIpc,
        'was called with',
        'lndRequest',
        'lndResponse',
        'some-method',
        'some-body'
      );
    });
  });

  describe('sendStreamCommand()', () => {
    it('should create duplex stream that parses json', () => {
      const method = 'some-method';
      const body = 'some-body';
      const stream = actionsGrpc.sendStreamCommand(method, body);
      expect(ipcRendererStub.send, 'was called with', 'lndStreamRequest', {
        method,
        body,
      });
      stream.write(JSON.stringify({ foo: 'bar' }), 'utf8');
      expect(ipcRendererStub.send, 'was called with', 'lndStreamWrite', {
        method,
        data: { foo: 'bar' },
      });
    });
  });

  describe('_sendIpc()', () => {
    const event = 'some-event';
    const listen = 'some-listener';
    const method = 'some-method';
    const body = 'some-body';

    it('should proxy request via ipc', async () => {
      ipcRendererStub.once
        .withArgs('some-listener_some-method')
        .yields(null, { response: 'some-response' });
      const response = await actionsGrpc._sendIpc(event, listen, method, body);
      expect(response, 'to equal', 'some-response');
      expect(ipcRendererStub.send, 'was called with', event, { method, body });
    });

    it('should proxy request without method/body', async () => {
      ipcRendererStub.once
        .withArgs('some-listener')
        .yields(null, { response: 'some-response' });
      const response = await actionsGrpc._sendIpc(event, listen);
      expect(response, 'to equal', 'some-response');
      expect(ipcRendererStub.send, 'was called with', event);
    });

    it('should proxy error via ipc', async () => {
      ipcRendererStub.once
        .withArgs('some-listener_some-method')
        .yields(null, { err: new Error('Boom!') });
      await expect(
        actionsGrpc._sendIpc(event, listen, method, body),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
