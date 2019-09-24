import { Store } from '../../../src/store';
import IpcAction from '../../../src/action/ipc';
import GrpcAction from '../../../src/action/grpc';
import * as logger from '../../../src/action/log';

describe('Action GRPC Unit Tests', () => {
  let store;
  let ipc;
  let grpc;
  let sandbox;
  let ipcRendererStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    ipcRendererStub = {
      on: sandbox.stub(),
      once: sandbox.stub(),
      send: sandbox.stub(),
    };
    ipc = new IpcAction(ipcRendererStub);
    grpc = new GrpcAction(store, ipc);
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

  describe('closeUnlocker()', () => {
    it('should send ipc close call', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.closeUnlocker();
      expect(grpc._sendIpc, 'was called with', 'unlockClose', 'unlockClosed');
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

  describe('initAutopilot()', () => {
    it('should set autopilotReady', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.initAutopilot();
      expect(store.autopilotReady, 'to be', true);
    });
  });

  describe('sendAutopilotCommand()', () => {
    it('should send ipc with correct args', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.sendAutopilotCommand('some-method', 'some-body');
      expect(
        grpc._sendIpc,
        'was called with',
        'lndAtplRequest',
        'lndAtplResponse',
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

  describe('closeLnd()', () => {
    it('should send ipc close call', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.closeLnd();
      expect(grpc._sendIpc, 'was called with', 'lndClose', 'lndClosed');
    });
  });

  describe('restartLnd()', () => {
    it('should send ipc close and restart calls', async () => {
      sandbox.stub(grpc, '_sendIpc').resolves();
      await grpc.restartLnd();
      expect(grpc._sendIpc, 'was called with', 'lndClose', 'lndClosed');
      expect(
        grpc._sendIpc,
        'was called with',
        'lnd-restart-process',
        'lnd-restart-error'
      );
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
        .yields(null, { err: { details: 'Boom!' } });
      await expect(
        grpc._sendIpc(event, listen, method, body),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
