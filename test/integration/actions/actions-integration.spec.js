import { observable, observe, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import * as logger from '../../../src/actions/logs';
import ActionsNav from '../../../src/actions/nav';
import ActionsWallet from '../../../src/actions/wallet';
import ActionsChannels from '../../../src/actions/channels';
import ActionsTransactions from '../../../src/actions/transactions';
import ActionsPayments from '../../../src/actions/payments';
import rmdir from './rmdir';

const {
  createGrpcClient,
  startLndProcess,
  startBtcdProcess,
} = require('../../../public/lnd-child-process');

const isDev = true;
let LND_DATA_DIR_1 = 'test/data/lnd_data_1';
let LND_DATA_DIR_2 = 'test/data/lnd_data_2';
let LND_LOG_DIR_1 = 'test/data/lnd_log_1';
let LND_LOG_DIR_2 = 'test/data/lnd_log_2';
let LND_PORT_1 = 10001;
let LND_PORT_2 = 10002;
let LND_PEER_PORT_1 = 10011;
let LND_PEER_PORT_2 = 10012;
let LND_REST_PORT_1 = 8001;
let LND_REST_PORT_2 = 8002;
let MACAROONS_ENABLED = false;

describe('Actions Integration Tests', function() {
  this.timeout(60000);

  let store1;
  let store2;
  let sandbox;
  let lndProcess1;
  let lndProcess2;
  let btcdProcess;
  let navStub1;
  let grpc1;
  let wallet1;
  let channels1;
  let transactions1;
  let payments1;
  let navStub2;
  let grpc2;
  let wallet2;
  let channels2;
  let transactions2;
  let payments2;
  let sendLog;

  before(async () => {
    rmdir('test/data');
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    sendLog = sinon.stub();
    useStrict(false);
    store1 = observable({ lndReady: false, loaded: false });
    store2 = observable({ lndReady: false, loaded: false });
    const globalStub1 = {};
    const remoteStub1 = { getGlobal: arg => globalStub1[arg] };
    const globalStub2 = {};
    const remoteStub2 = { getGlobal: arg => globalStub2[arg] };

    btcdProcess = await startBtcdProcess({ isDev, logger, sendLog });
    lndProcess1 = await startLndProcess({
      isDev,
      macaroonsEnabled: MACAROONS_ENABLED,
      lndDataDir: LND_DATA_DIR_1,
      lndLogDir: LND_LOG_DIR_1,
      lndPort: LND_PORT_1,
      lndPeerPort: LND_PEER_PORT_1,
      lndRestPort: LND_REST_PORT_1,
      logger,
      sendLog,
    });
    lndProcess2 = await startLndProcess({
      isDev,
      macaroonsEnabled: MACAROONS_ENABLED,
      lndDataDir: LND_DATA_DIR_2,
      lndLogDir: LND_LOG_DIR_2,
      lndPort: LND_PORT_2,
      lndPeerPort: LND_PEER_PORT_2,
      lndRestPort: LND_REST_PORT_2,
      logger,
      sendLog,
    });

    await createGrpcClient({
      global: globalStub1,
      lndPort: LND_PORT_1,
      macaroonsEnabled: MACAROONS_ENABLED,
    });
    await createGrpcClient({
      global: globalStub2,
      lndPort: LND_PORT_2,
      macaroonsEnabled: MACAROONS_ENABLED,
    });

    navStub1 = sinon.createStubInstance(ActionsNav);
    grpc1 = new ActionsGrpc(store1, remoteStub1);
    wallet1 = new ActionsWallet(store1, grpc1, navStub1);
    channels1 = new ActionsChannels(store1, grpc1);
    transactions1 = new ActionsTransactions(store1, grpc1);
    payments1 = new ActionsPayments(store1, grpc1, wallet1);

    navStub2 = sinon.createStubInstance(ActionsNav);
    grpc2 = new ActionsGrpc(store2, remoteStub2);
    wallet2 = new ActionsWallet(store2, grpc2, navStub2);
    channels2 = new ActionsChannels(store2, grpc2);
    transactions2 = new ActionsTransactions(store2, grpc2);
    payments2 = new ActionsPayments(store2, grpc2, wallet2);

    await new Promise(resolve => observe(store1, 'lndReady', resolve));
    await new Promise(resolve => observe(store2, 'lndReady', resolve));
  });

  after(() => {
    lndProcess1.kill();
    lndProcess2.kill();
    btcdProcess.kill();
    sandbox.restore();
  });

  describe('ActionsChannels.getChannels()', () => {
    it('should list no channels initially', async () => {
      await new Promise(resolve =>
        setTimeout(() => store1.channelsResponse && resolve(), 100)
      );
      expect(store1.channelsResponse, 'to equal', []);

      expect(
        navStub1 &&
          grpc1 &&
          wallet1 &&
          channels1 &&
          transactions1 &&
          payments1 &&
          navStub2 &&
          grpc2 &&
          wallet2 &&
          channels2 &&
          transactions2 &&
          payments2,
        'to be ok'
      );
    });
  });
});
