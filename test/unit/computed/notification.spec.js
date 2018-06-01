import { observable, useStrict } from 'mobx';
import ComputedNotification from '../../../src/computed/notification';

describe('Computed Notification Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      notifications: [],
    });
  });

  describe('ComputedNotification()', () => {
    it('should work with initial store', () => {
      ComputedNotification(store);
      expect(store.lastNotification, 'to equal', null);
      expect(store.displayNotification, 'to equal', false);
    });

    it('should set notification attributes', () => {
      store.notifications.push({
        type: 'error',
        message: 'Oops something went wrong',
        display: true,
      });
      ComputedNotification(store);
      expect(store.lastNotification.type, 'to equal', 'error');
      expect(store.displayNotification, 'to equal', true);
    });
  });
});
