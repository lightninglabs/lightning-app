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
      UnlockWallet: sinon.stub(),
      start: sinon.stub(),
      close: sinon.stub(),
      GetInfo: sinon.stub(),
      SendCoins: sinon.stub(),
      OpenChannelStreamRequest: sinon.stub(),
      SendPaymentStreamRequest: sinon.stub(),
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
      LndReactModuleStub.UnlockWallet.resolves(
        grpc._serializeResponse('UnlockWallet')
      );
      await grpc.sendUnlockerCommand('UnlockWallet', {
        wallet_password: 'secret',
      });
      expect(LndReactModuleStub.UnlockWallet, 'was called with', 'CgSx5yt6');
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
      LndReactModuleStub.GetInfo.resolves(grpc._serializeResponse('GetInfo'));
      await grpc.sendCommand('GetInfo');
      expect(LndReactModuleStub.GetInfo, 'was called with', '');
    });

    it('should work without body (lowercase)', async () => {
      LndReactModuleStub.GetInfo.resolves(grpc._serializeResponse('GetInfo'));
      await grpc.sendCommand('getInfo');
      expect(LndReactModuleStub.GetInfo, 'was called with', '');
    });

    it('should work with body', async () => {
      LndReactModuleStub.SendCoins.resolves(
        grpc._serializeResponse('SendCoins')
      );
      await grpc.sendCommand('SendCoins', {
        addr: 'some-address',
        amount: 42,
      });
      expect(
        LndReactModuleStub.SendCoins,
        'was called with',
        'Cgxzb21lLWFkZHJlc3MQKg=='
      );
    });
  });

  describe('sendStreamCommand()', () => {
    it('should create unidirectional stream', () => {
      const stream = grpc.sendStreamCommand('OpenChannel', {
        node_pubkey: new Buffer('FFFF', 'hex'),
        local_funding_amount: 42,
      });
      expect(stream, 'to be ok');
      expect(
        LndReactModuleStub.OpenChannelStreamRequest,
        'was called with',
        'EgL//yAq'
      );
    });

    it.skip('should create duplex stream that parses json', () => {
      const stream = grpc.sendStreamCommand('SendPayment');
      expect(
        LndReactModuleStub.SendPaymentStreamRequest,
        'was called with',
        'EgL//yAq'
      );
      stream.write(JSON.stringify({ foo: 'bar' }), 'utf8');
      expect(
        LndReactModuleStub.SendPaymentStreamWrite,
        'was called with',
        'EgL//yAq'
      );
    });
  });
});
