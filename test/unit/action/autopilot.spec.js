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
      await autopilot.init();
      expect(grpc.sendAutopilotCommand, 'was called with', 'modifyStatus', {
        enable: true,
      });
    });

    it('should not enable autopilot if disabled', async () => {
      store.settings.autopilot = false;
      await autopilot.init();
      expect(grpc.sendAutopilotCommand, 'was not called');
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
});
