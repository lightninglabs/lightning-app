import { observable, observe, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import * as logger from '../../../src/actions/logs';
import ActionsChannels from '../../../src/actions/channels';
const {
  createGrpcClient,
  startLndProcess,
} = require('../../../public/lnd-child-process');

const LND_NAME = 'lnd';
let LND_DATA_DIR = 'lnd_data/lnd';
let LND_LOG_DIR = 'lnd_log';
let LND_PORT = 10009;
let LND_PEER_PORT = 10019;
let MACAROONS_ENABLED = false;

describe('Actions Integration Tests', function() {
  this.timeout(60000);

  let store;
  let sandbox;
  let lndProcess;
  let actionsGrpc;
  let actionsChannels;

  before(async () => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    const globalStub = {};
    const remoteStub = { getGlobal: arg => globalStub[arg] };

    lndProcess = startLndProcess({
      lndName: LND_NAME,
      isDev: true,
      macaroonsEnabled: MACAROONS_ENABLED,
      lndDataDir: LND_DATA_DIR,
      lndLogDir: LND_LOG_DIR,
      lndPort: LND_PORT,
      lndPeerPort: LND_PEER_PORT,
      logger,
      sendLog: sinon.stub(),
    });
    await createGrpcClient({
      global: globalStub,
      lndPort: LND_PORT,
      macaroonsEnabled: MACAROONS_ENABLED,
    });

    actionsGrpc = new ActionsGrpc(store, remoteStub);
    actionsChannels = new ActionsChannels(store, actionsGrpc);
    await new Promise(resolve => observe(store, 'lndReady', resolve));
  });

  after(() => {
    lndProcess.kill();
    sandbox.restore();
  });

  describe('getChannels()', () => {
    it('should list no channels initially', async () => {
      await new Promise(resolve =>
        setTimeout(() => store.channelsResponse && resolve(), 100)
      );
      expect(store.channelsResponse, 'to equal', []);
    });
  });
});
