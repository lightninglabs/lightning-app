import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc-mobile';
import * as logger from '../../../src/action/log';

describe('Action GRPC Mobile Unit Tests', () => {
  let store;
  let grpc;
  let sandbox;
  let LndReactModuleStub;
  let NativeEventEmitterStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    LndReactModuleStub = {
      startUnlocker: sinon.stub(),
      closeUnlocker: sinon.stub(),
      start: sinon.stub(),
      close: sinon.stub(),
      sendCommand: sinon.stub(),
      sendStreamCommand: sinon.stub(),
      sendStreamWrite: sinon.stub(),
    };
    const NativeModulesStub = {
      LndReactModule: LndReactModuleStub,
    };
    NativeEventEmitterStub = function() {};
    NativeEventEmitterStub.prototype.addListener = sinon.stub();
    grpc = new GrpcAction(store, NativeModulesStub, NativeEventEmitterStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initUnlocker()', () => {
    it('should set unlockerReady', async () => {
      LndReactModuleStub.startUnlocker.resolves();
      await grpc.initUnlocker();
      expect(store.unlockerReady, 'to be', true);
    });
  });

  describe('closeUnlocker()', () => {
    it('should send ipc close call', async () => {
      LndReactModuleStub.closeUnlocker.resolves();
      await grpc.closeUnlocker();
      expect(LndReactModuleStub.closeUnlocker, 'was called once');
    });
  });

  describe('sendUnlockerCommand()', () => {
    it('should send ipc with correct args', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('UnlockWallet')
      );
      await grpc.sendUnlockerCommand('UnlockWallet', {
        wallet_password: 'secret',
      });
      expect(
        LndReactModuleStub.sendCommand,
        'was called with',
        'UnlockWallet',
        'CgSx5yt6'
      );
    });
  });

  describe('initLnd()', () => {
    it('should set lndReady', async () => {
      LndReactModuleStub.start.resolves();
      await grpc.initLnd();
      expect(store.lndReady, 'to be', true);
    });
  });

  describe('closeLnd()', () => {
    it('should send ipc close call', async () => {
      LndReactModuleStub.close.resolves();
      await grpc.closeLnd();
      expect(LndReactModuleStub.close, 'was called once');
    });
  });

  describe('restartLnd()', () => {
    it('should send ipc close and restart calls', async () => {
      LndReactModuleStub.close.resolves();
      await grpc.restartLnd();
      expect(LndReactModuleStub.close, 'was called once');
    });
  });

  describe('sendCommand()', () => {
    it('should work without body', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('GetInfo')
      );
      await grpc.sendCommand('GetInfo');
      expect(LndReactModuleStub.sendCommand, 'was called with', 'GetInfo', '');
    });

    it('should work without body (lowercase)', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('GetInfo')
      );
      await grpc.sendCommand('getInfo');
      expect(LndReactModuleStub.sendCommand, 'was called with', 'GetInfo', '');
    });

    it('should work with body', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('SendCoins')
      );
      await grpc.sendCommand('SendCoins', {
        addr: 'some-address',
        amount: 42,
      });
      expect(
        LndReactModuleStub.sendCommand,
        'was called with',
        'SendCoins',
        'Cgxzb21lLWFkZHJlc3MQKg=='
      );
    });
  });

  describe('sendStreamCommand()', () => {
    it('should create unidirectional stream', done => {
      grpc._lndEvent.addListener.yieldsAsync(null, {
        streamId: '1',
        event: 'data',
        data: 'foo',
      });
      const stream = grpc.sendStreamCommand('OpenChannel', {
        node_pubkey: new Buffer('FFFF', 'hex'),
        local_funding_amount: 42,
      });
      expect(
        LndReactModuleStub.sendStreamCommand,
        'was called with',
        'OpenChannel',
        '1',
        'EgL//yAq'
      );
      stream.on('data', data => {
        expect(data, 'to equal', 'foo');
        done();
      });
    });

    it('should create duplex stream that parses json', () => {
      const stream = grpc.sendStreamCommand('SendPayment');
      expect(
        LndReactModuleStub.sendStreamCommand,
        'was called with',
        'SendPayment',
        '1',
        ''
      );
      stream.write(JSON.stringify({ payment_request: 'foo' }), 'utf8');
      expect(
        LndReactModuleStub.sendStreamWrite,
        'was called with',
        '1',
        'MgNmb28='
      );
    });

    it('should fail on stream error', done => {
      grpc._lndEvent.addListener.yieldsAsync(new Error('Boom!'));
      const stream = grpc.sendStreamCommand('SendPayment');
      stream.on('error', err => {
        expect(err.message, 'to equal', 'Boom!');
        done();
      });
    });
  });

  describe('_generateStreamId()', () => {
    it('should increment stream counter and generate a string', () => {
      expect(grpc._streamCounter, 'to equal', 0);
      expect(grpc._generateStreamId(), 'to equal', '1');
      expect(grpc._streamCounter, 'to equal', 1);
      expect(grpc._generateStreamId(), 'to equal', '2');
      expect(grpc._streamCounter, 'to equal', 2);
    });
  });
});
