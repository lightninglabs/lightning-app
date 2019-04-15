/**
 * @fileOverview computed values that are used in notification UI components.
 */

import { extendObservable } from 'mobx';
import { toCaps, formatNumber } from '../helper';

const ComputedNotification = store => {
  extendObservable(store, {
    get lastNotification() {
      const { notifications: nots } = store;
      return nots.length ? nots[nots.length - 1] : null;
    },
    get displayNotification() {
      const { lastNotification: last } = store;
      return last ? last.display : false;
    },
    get computedNotifications() {
      const { notifications } = store;
      const all = [];
      notifications.forEach(n => {
        if (n.waiting && all.find(a => a.waiting)) {
          return;
        }
        all.push(n);
      });
      all.sort((a, b) => b.date.getTime() - a.date.getTime());
      all.forEach((n, i) => {
        n.key = String(i);
        n.typeLabel = toCaps(n.type);
        n.dateLabel = n.date.toLocaleDateString();
        n.dateTimeLabel = n.date.toLocaleString();
      });
      return all;
    },
    get notificationCountLabel() {
      return formatNumber(store.unseenNtfnCount);
    },
  });
};

export default ComputedNotification;
