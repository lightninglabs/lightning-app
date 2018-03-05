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
    notification = new ActionsNotification(store);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('display()', () => {
    it('create info notification by default', async () => {
      notification.display({ message: 'hello' });
      expect(log.error, 'was not called');
      expect(store.notification, 'to equal', {
        type: 'info',
        message: 'hello',
      });
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
      expect(store.notification, 'to equal', {
        type: 'error',
        message: 'hello',
        handler,
        handlerLbl: 'Fix this',
      });
    });
  });

  describe('close()', () => {
    it('to remove notification', async () => {
      notification.display({ message: 'hello' });
      notification.close();
      expect(store.notification, 'to be null');
    });
  });
});
