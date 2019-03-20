import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import NotificationAction from '../../../src/action/notification';
import AppStorage from '../../../src/action/app-storage';
import AtplAction from '../../../src/action/autopilot';
import * as logger from '../../../src/action/log';

describe('Action Autopilot Unit Test', () => {
  let store;
  let db;
  let grpc;
  let notify;
  let autopilot;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    require('../../../src/config').ATPL_UPDATE_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    db = sinon.createStubInstance(AppStorage);
    notify = sinon.createStubInstance(NotificationAction);
    autopilot = new AtplAction(store, grpc, db, notify);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('init()', () => {
    it('should enable autopilot by default', async () => {
      sandbox.stub(autopilot, 'updateAutopilotScores');
      autopilot.updateAutopilotScores.resolves(true);
      await autopilot.init();
      expect(grpc.sendAutopilotCommand, 'was called with', 'modifyStatus', {
        enable: true,
      });
    });

    it('should not enable autopilot if disabled', async () => {
      sandbox.stub(autopilot, 'updateAutopilotScores');
      autopilot.updateAutopilotScores.resolves(true);
      store.settings.autopilot = false;
      await autopilot.init();
      expect(grpc.sendAutopilotCommand, 'was not called');
    });

    it('should poll the bos score', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        chains: [{ network: 'testnet' }],
      });
      sandbox.stub(autopilot, 'updateAutopilotScores');
      autopilot.updateAutopilotScores.onThirdCall().resolves(true);
      await autopilot.init();
      expect(autopilot.updateAutopilotScores, 'was called thrice');
    });
  });

  describe('toggle()', () => {
    it('should toggle autopilot', async () => {
      grpc.sendAutopilotCommand.resolves();
      store.settings.autopilot = true;
      await autopilot.toggle();
      expect(store.settings.autopilot, 'to equal', false);
      expect(db.save, 'was called once');
    });

    it('should display a notification on error', async () => {
      grpc.sendAutopilotCommand.rejects();
      store.settings.autopilot = true;
      await autopilot.toggle();
      expect(store.settings.autopilot, 'to equal', true);
      expect(db.save, 'was not called');
    });
  });

  describe('updateAutopilotScores()', async () => {
    it('should update autopilot with fresh bos scores', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        chains: [{ network: 'testnet' }],
      });
      await autopilot.updateAutopilotScores();
      expect(grpc.sendAutopilotCommand.callCount, 'to equal', 1);
      expect(db.save, 'was called once');
      expect(store.settings.atplTestnetScores, 'not to equal', {});
    });

    it('should log on error', async () => {
      grpc.sendAutopilotCommand.rejects();
      await autopilot.updateAutopilotScores();
      expect(logger.error, 'was called once');
      expect(db.save, 'was not called');
    });
  });

  describe('fetchBosScores', async () => {
    it('should fetch bos scores', async () => {
      grpc.sendCommand.withArgs('getInfo').resolves({
        chains: [{ network: 'testnet' }],
      });
      let scores = await autopilot.fetchBosScores();
      expect(Object.keys(scores).length, 'to be greater than', 0);
    });

    it('should throw an error on failure', async () => {
      sandbox.stub(autopilot, '_getNetwork');
      autopilot._getNetwork.rejects(new Error('Boom!'));
      await expect(
        autopilot.fetchBosScores(),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
