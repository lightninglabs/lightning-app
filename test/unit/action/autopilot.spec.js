import { Store } from '../../../src/store';
import IpcAction from '../../../src/action/ipc';
import NotificationAction from '../../../src/action/notification';
import AppStorage from '../../../src/action/app-storage';
import AtplAction from '../../../src/action/autopilot';
import * as logger from '../../../src/action/log';

describe('Action Setting Unit Test', () => {
  let store;
  let db;
  let ipc;
  let notify;
  let autopilot;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    ipc = sinon.createStubInstance(IpcAction);
    db = sinon.createStubInstance(AppStorage);
    notify = sinon.createStubInstance(NotificationAction);
    autopilot = new AtplAction(store, ipc, db, notify);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initAutopilot()', () => {
    it('should set autopilotReady', async () => {
      await autopilot.initAutopilot();
      expect(store.autopilotReady, 'to be', true);
    });
  });

  describe('toggleAutopilot()', () => {
    it('should toggle autopilot', async () => {
      store.settings.autopilot = true;
      await autopilot.toggleAutopilot();
      expect(store.settings.autopilot, 'to equal', false);
      expect(notify.display, 'was not called');
    });

    it('should display a notification on error', async () => {
      store.settings.autopilot = true;
      sandbox.stub(autopilot, 'sendAutopilotCommand').rejects();
      await autopilot.toggleAutopilot();
      expect(store.settings.autopilot, 'to equal', true);
      expect(notify.display, 'was called once');
    });
  });

  describe('sendAutopilotCommand()', () => {
    it('should send ipc with correct args', async () => {
      sandbox.stub(autopilot, '_sendIpc').resolves();
      await autopilot.sendAutopilotCommand('some-method', 'some-body');
      expect(
        autopilot._sendIpc,
        'was called with',
        'lndAtplRequest',
        'lndAtplResponse',
        'some-method',
        'some-body'
      );
    });
  });

  describe('setAtplStatus', () => {
    it('should return undefined on success', async () => {
      sandbox.stub(autopilot, '_sendIpc').resolves();
      const rv = await autopilot.setAtplStatus({ enable: true });
      expect(rv, 'to be undefined');
    });

    it('should return an error on failure', async () => {
      sandbox.stub(autopilot, '_sendIpc').rejects(new Error('Boom!'));
      const err = await autopilot.setAtplStatus({ enable: true });
      expect(err, 'to be ok');
    });
  });
});
