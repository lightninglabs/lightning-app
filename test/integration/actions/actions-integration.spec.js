import { observable, observe, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import * as logger from '../../../src/actions/logs';
import ActionsNav from '../../../src/actions/nav';
import ActionsWallet from '../../../src/actions/wallet';
import ActionsChannels from '../../../src/actions/channels';
import ActionsTransactions from '../../../src/actions/transactions';
import ActionsPayments from '../../../src/actions/payments';

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
  let actionsNavStub;
  let actionsGrpc;
  let actionsWallet;
  let actionsChannels;
  let actionsTransactions;
  let actionsPayments;

  before(async () => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store = observable({
      lndReady: false,
      loaded: false,
    });
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

    actionsNavStub = sinon.createStubInstance(ActionsNav);
    actionsGrpc = new ActionsGrpc(store, remoteStub);
    actionsWallet = new ActionsWallet(store, actionsGrpc, actionsNavStub);
    actionsChannels = new ActionsChannels(store, actionsGrpc);
    actionsTransactions = new ActionsTransactions(store, actionsGrpc);
    actionsPayments = new ActionsPayments(store, actionsGrpc, actionsWallet);
    await new Promise(resolve => observe(store, 'lndReady', resolve));
  });

  after(() => {
    lndProcess.kill();
    sandbox.restore();
  });

  describe('ActionsChannels.getChannels()', () => {
    it('should list no channels initially', async () => {
      await new Promise(resolve =>
        setTimeout(() => store.channelsResponse && resolve(), 100)
      );
      expect(store.channelsResponse, 'to equal', []);
    });
  });
});
