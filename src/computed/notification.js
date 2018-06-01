import { computed, extendObservable } from 'mobx';

const ComputedNotification = store => {
  extendObservable(store, {
    lastNotification: computed(() => {
      const { notifications: nots } = store;
      return nots.length ? nots[nots.length - 1] : null;
    }),
    displayNotification: computed(() => {
      const { lastNotification: last } = store;
      return last ? last.display : false;
    }),
  });
};

export default ComputedNotification;
