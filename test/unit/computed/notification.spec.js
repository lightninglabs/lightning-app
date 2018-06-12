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
      expect(store.computedNotifications, 'to equal', []);
    });

    it('should set notification attributes', () => {
      store.notifications.push({
        type: 'error',
        message: 'Oops something went wrong',
        date: new Date(1528703821406),
        display: true,
      });
      ComputedNotification(store);
      expect(store.lastNotification.type, 'to equal', 'error');
      expect(store.displayNotification, 'to equal', true);
      expect(store.computedNotifications, 'to satisfy', [
        {
          typeLabel: 'Error',
          message: 'Oops something went wrong',
          dateLabel: new Date(1528703821406).toLocaleDateString(),
          dateTimeLabel: new Date(1528703821406).toLocaleString(),
        },
      ]);
    });
  });
});
