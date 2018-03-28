import { computed, extendObservable } from 'mobx';

const ComputedChannel = store => {
  extendObservable(store, {
    computedChannels: computed(() => {
      const { channels, pendingChannels } = store;
      const c = channels ? channels.slice() : [];
      const p = pendingChannels ? pendingChannels.slice() : [];
      const all = [].concat(c, p);
      all.sort(
        (a, b) => (a.status > b.status ? 1 : a.status < b.status ? -1 : 0)
      );
      all.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
      return all;
    }),
  });
};

export default ComputedChannel;
