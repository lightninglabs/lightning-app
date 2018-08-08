/**
 * @fileOverview computed values that are used in channel UI components.
 */

import { computed, extendObservable } from 'mobx';
import { toAmountLabel, toCaps } from '../helper';

const ComputedChannel = store => {
  extendObservable(store, {
    computedChannels: computed(() => {
      const { channels, pendingChannels, settings } = store;
      const c = channels ? channels.slice() : [];
      const p = pendingChannels ? pendingChannels.slice() : [];
      const all = [].concat(c, p);
      all.sort(
        (a, b) => (a.status > b.status ? -1 : a.status < b.status ? 1 : 0)
      );
      all.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
      all.forEach(c => {
        c.statusLabel = toCaps(c.status);
        c.capacityLabel = toAmountLabel(c.capacity, settings);
        c.localBalanceLabel = toAmountLabel(c.localBalance, settings);
        c.remoteBalanceLabel = toAmountLabel(c.remoteBalance, settings);
      });
      return all;
    }),
    channelBalanceOpenLabel: computed(() => {
      const { channels, settings } = store;
      const sum = (channels || [])
        .map(c => Number(c.localBalance))
        .reduce((a, b) => a + b, 0);
      return toAmountLabel(sum, settings);
    }),
    channelBalancePendingLabel: computed(() => {
      const { pendingChannels, settings } = store;
      const sum = (pendingChannels || [])
        .filter(c => c.status.includes('open'))
        .map(c => Number(c.localBalance))
        .reduce((a, b) => a + b, 0);
      return toAmountLabel(sum, settings);
    }),
    channelBalanceClosingLabel: computed(() => {
      const { pendingChannels, settings } = store;
      const sum = (pendingChannels || [])
        .filter(c => !c.status.includes('open'))
        .map(c => Number(c.localBalance))
        .reduce((a, b) => a + b, 0);
      return toAmountLabel(sum, settings);
    }),
    showChannelAlert: computed(() => (store.channels || []).length === 0),
  });
};

export default ComputedChannel;
