import { Store } from '../../../src/store';
import * as log from '../../../src/actions/logs';
import ActionsNotification from '../../../src/actions/notification';

describe('Actions Notification Unit Tests', () => {
  let store;
  let sandbox;
  let notification;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(log);
    store = new Store();
    require('../../../src/config').NOTIFICATION_DELAY = 1;
    notification = new ActionsNotification(store);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('display()', () => {
    it('create info notification and hide after delay', async () => {
      notification.display({ message: 'hello' });
      expect(store.notifications[0], 'to equal', {
        type: 'info',
        message: 'hello',
        display: true,
      });
      expect(log.error, 'was not called');
      await nap(10);
      expect(store.notifications[0].display, 'to be', false);
    });

    it('create log error', async () => {
      const error = new Error('Boom!');
      const handler = () => {};
      notification.display({
        type: 'error',
        message: 'hello',
        error,
        handler,
        handlerLbl: 'Fix this',
      });
      expect(log.error, 'was called with', 'hello', error);
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
      notification.display({ message: 'hello' });
      expect(store.notifications[0].display, 'to be', true);
      notification.close();
      expect(store.notifications[0].display, 'to be', false);
    });
  });
});
