import { Store } from '../../../src/store';
import * as log from '../../../src/action/logs';
import NotificationAction from '../../../src/action/notification';

describe('Action Notification Unit Tests', () => {
  let store;
  let sandbox;
  let notification;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(log);
    store = new Store();
    require('../../../src/config').NOTIFICATION_DELAY = 1;
    notification = new NotificationAction(store);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('display()', () => {
    it('create info notification and hide after delay', async () => {
      notification.display({ msg: 'hello' });
      expect(store.notifications[0], 'to equal', {
        type: 'info',
        message: 'hello',
        display: true,
      });
      expect(log.error, 'was not called');
      await nap(10);
      expect(store.notifications[0].display, 'to be', false);
    });

    it('create warning notification when type is set', async () => {
      notification.display({ type: 'warning', msg: 'hello' });
      expect(store.notifications[0], 'to equal', {
        type: 'warning',
        message: 'hello',
        display: true,
      });
      expect(log.error, 'was not called');
    });

    it('create log error', async () => {
      const err = new Error('Boom!');
      const handler = () => {};
      notification.display({
        msg: 'hello',
        err,
        handler,
        handlerLbl: 'Fix this',
      });
      expect(log.error, 'was called with', 'hello', err);
      expect(store.notifications[0], 'to equal', {
        type: 'error',
        message: 'hello',
        handler,
        handlerLbl: 'Fix this',
        display: true,
      });
    });
  });

  describe('close()', () => {
    it('stop displaying all notifications', async () => {
      notification.display({ msg: 'hello' });
      expect(store.notifications[0].display, 'to be', true);
      notification.close();
      expect(store.notifications[0].display, 'to be', false);
    });
  });
});
