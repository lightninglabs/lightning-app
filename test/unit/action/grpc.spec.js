import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import * as logger from '../../../src/action/logs';

describe('Action GRPC Unit Tests', () => {
  let store;
  let grpc;
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
    grpc = new GrpcAction(store, ipcRendererStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initUnlocker()', () => {
    it('should set unlockerReady', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.initUnlocker();
      expect(store.unlockerReady, 'to be', true);
    });
  });

  describe('sendUnlockerCommand()', () => {
    it('should send ipc with correct args', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.sendUnlockerCommand('some-method', 'some-body');
      expect(
        grpc._sendIpc,
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
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.initLnd();
      expect(store.lndReady, 'to be', true);
    });
  });

  describe('sendCommand()', () => {
    it('should send ipc with correct args', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.sendCommand('some-method', 'some-body');
      expect(
        grpc._sendIpc,
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
      const stream = grpc.sendStreamCommand(method, body);
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
      const response = await grpc._sendIpc(event, listen, method, body);
      expect(response, 'to equal', 'some-response');
      expect(ipcRendererStub.send, 'was called with', event, { method, body });
    });

    it('should proxy request without method/body', async () => {
      ipcRendererStub.once
        .withArgs('some-listener')
        .yields(null, { response: 'some-response' });
      const response = await grpc._sendIpc(event, listen);
      expect(response, 'to equal', 'some-response');
      expect(ipcRendererStub.send, 'was called with', event);
    });

    it('should proxy error via ipc', async () => {
      ipcRendererStub.once
        .withArgs('some-listener_some-method')
        .yields(null, { err: new Error('Boom!') });
      await expect(
        grpc._sendIpc(event, listen, method, body),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
