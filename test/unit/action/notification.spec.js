import { Store } from '../../../src/store';
import * as log from '../../../src/action/log';
import NavAction from '../../../src/action/nav';
import NotificationAction from '../../../src/action/notification';
import { nap } from '../../../src/helper';

describe('Action Notification Unit Tests', () => {
  let store;
  let sandbox;
  let nav;
  let notification;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(log);
    store = new Store();
    require('../../../src/config').NOTIFICATION_DELAY = 1;
    nav = sinon.createStubInstance(NavAction);
    notification = new NotificationAction(store, nav);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('display()', () => {
    it('create info notification and hide after delay', async () => {
      notification.display({ msg: 'hello' });
      expect(store.notifications[0], 'to satisfy', {
        type: 'info',
        message: 'hello',
        handler: null,
        handlerLbl: null,
        display: true,
      });
      expect(log.error, 'was not called');
      await nap(10);
      expect(store.notifications[0].display, 'to be', false);
    });

    it('create warning notification when type is set', () => {
      notification.display({ type: 'warning', msg: 'hello' });
      expect(store.notifications[0], 'to satisfy', {
        type: 'warning',
        message: 'hello',
        handler: null,
        handlerLbl: null,
        display: true,
      });
      expect(log.error, 'was not called');
    });

    it('create log error', () => {
      const err = new Error('Boom!');
      const handler = () => {};
      notification.display({
        msg: 'hello',
        err,
        handler,
        handlerLbl: 'Fix this',
      });
      expect(log.error, 'was called with', 'hello', err);
      expect(store.notifications[0], 'to satisfy', {
        type: 'error',
        message: 'hello',
        handler,
        handlerLbl: 'Fix this',
        display: true,
      });
    });

    it('set default error handler if not is set', () => {
      const err = new Error('Boom!');
      notification.display({
        msg: 'hello',
        err,
      });
      expect(store.notifications[0], 'to satisfy', {
        type: 'error',
        message: 'hello',
        handlerLbl: 'Show error logs',
        display: true,
      });
      store.notifications[0].handler();
      expect(nav.goCLI, 'was called once');
    });

    it('avoid redundant notifications but update date', async () => {
      notification.display({ msg: 'hello' });
      const date = store.notifications[0].date;
      await nap(10);
      notification.display({ msg: 'hello' });
      expect(store.notifications.length, 'to equal', 1);
      expect(store.notifications[0].date, 'not to equal', date);
    });
  });

  describe('close()', () => {
    it('stop displaying all notifications', () => {
      notification.display({ msg: 'hello' });
      expect(store.notifications[0].display, 'to be', true);
      notification.close();
      expect(store.notifications[0].display, 'to be', false);
    });
  });
});
