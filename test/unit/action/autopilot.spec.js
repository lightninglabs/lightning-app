import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import NotificationAction from '../../../src/action/notification';
import AppStorage from '../../../src/action/app-storage';
import AtplAction from '../../../src/action/autopilot';
import * as logger from '../../../src/action/log';
import nock from 'nock';
import 'isomorphic-fetch';

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
    require('../../../src/config').ATPL_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    db = sinon.createStubInstance(AppStorage);
    notify = sinon.createStubInstance(NotificationAction);
    autopilot = new AtplAction(store, grpc, db, notify);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('init()', () => {
    beforeEach(() => {
      sandbox.stub(autopilot, 'updateNodeScores').resolves();
      autopilot.updateNodeScores.onThirdCall().resolves(true);
    });

    it('should enable autopilot and fetch scores by default', async () => {
      await autopilot.init();
      expect(grpc.sendAutopilotCommand, 'was called with', 'modifyStatus', {
        enable: true,
      });
      expect(autopilot.updateNodeScores, 'was called thrice');
    });

    it('should not enable autopilot if disabled but fetch scores', async () => {
      store.settings.autopilot = false;
      await autopilot.init();
      expect(grpc.sendAutopilotCommand, 'was not called');
      expect(autopilot.updateNodeScores, 'was called thrice');
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

  describe('updateNodeScores()', async () => {
    let scoresJson;

    beforeEach(() => {
      scoresJson = {
        last_updated: '2019-03-21T04:39:41.031Z',
        scores: [
          {
            alias: 'some-alias',
            public_key: 'some-pubkey',
            score: 14035087,
          },
        ],
      };
      store.network = 'testnet';
    });

    it('should fail if network cannot be read', async () => {
      store.network = null;
      await autopilot.updateNodeScores();
      expect(logger.error, 'was called once');
      expect(grpc.sendAutopilotCommand, 'was not called');
      expect(db.save, 'was not called');
      expect(store.settings.nodeScores, 'to equal', {});
    });

    it('should read scores for testnet from empty cache', async () => {
      nock('https://nodes.lightning.computer')
        .get('/availability/v1/btctestnet.json')
        .reply(500, 'Boom!');

      await autopilot.updateNodeScores();
      expect(grpc.sendAutopilotCommand, 'was not called');
      expect(logger.error, 'was called twice');
      expect(db.save, 'was not called');
      expect(store.settings.nodeScores, 'to equal', {});
    });

    it('should handle invalid score format', async () => {
      delete scoresJson.scores[0].public_key;
      nock('https://nodes.lightning.computer')
        .get('/availability/v1/btctestnet.json')
        .reply(200, scoresJson);

      await autopilot.updateNodeScores();
      expect(logger.error, 'was called twice');
      expect(grpc.sendAutopilotCommand, 'was not called');
      expect(db.save, 'was not called');
      expect(store.settings.nodeScores, 'to equal', {});
    });

    it('should read scores for testnet from cache', async () => {
      nock('https://nodes.lightning.computer')
        .get('/availability/v1/btctestnet.json')
        .reply(500, 'Boom!');
      store.settings.nodeScores = {
        testnet: { 'some-pubkey': 0.14035087 },
      };

      await autopilot.updateNodeScores();
      expect(grpc.sendAutopilotCommand, 'was called with', 'setScores', {
        heuristic: 'externalscore',
        scores: { 'some-pubkey': 0.14035087 },
      });
      expect(logger.error, 'was called once');
      expect(db.save, 'was not called');
      expect(store.settings.nodeScores, 'to equal', {
        testnet: { 'some-pubkey': 0.14035087 },
      });
    });

    it('should set scores for testnet', async () => {
      nock('https://nodes.lightning.computer')
        .get('/availability/v1/btctestnet.json')
        .reply(200, scoresJson);

      await autopilot.updateNodeScores();
      expect(grpc.sendAutopilotCommand, 'was called with', 'setScores', {
        heuristic: 'externalscore',
        scores: { 'some-pubkey': 0.14035087 },
      });
      expect(db.save, 'was called once');
      expect(store.settings.nodeScores, 'to equal', {
        testnet: { 'some-pubkey': 0.14035087 },
      });
    });

    it('should set scores for mainnet', async () => {
      store.network = 'mainnet';
      nock('https://nodes.lightning.computer')
        .get('/availability/v1/btc.json')
        .reply(200, scoresJson);

      await autopilot.updateNodeScores();
      expect(grpc.sendAutopilotCommand, 'was called with', 'setScores', {
        heuristic: 'externalscore',
        scores: { 'some-pubkey': 0.14035087 },
      });
      expect(db.save, 'was called once');
      expect(store.settings.nodeScores, 'to equal', {
        mainnet: { 'some-pubkey': 0.14035087 },
      });
    });
  });
});
