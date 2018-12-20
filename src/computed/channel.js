/**
 * @fileOverview computed values that are used in channel UI components.
 */

import { extendObservable } from 'mobx';
import { toAmountLabel, toCaps } from '../helper';

const ComputedChannel = store => {
  extendObservable(store, {
    get computedChannels() {
      const { channels, pendingChannels, closedChannels, settings } = store;
      const c = channels ? channels.slice() : [];
      const p = pendingChannels ? pendingChannels.slice() : [];
      const cl = closedChannels ? closedChannels.slice() : [];
      c.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
      p.sort(
        (a, b) => (a.status > b.status ? -1 : a.status < b.status ? 1 : 0)
      );
      let all = [].concat(c, p, cl);
      all.forEach((c, i) => {
        c.key = String(i);
        c.statusLabel =
          c.status == 'open' && !c.active ? 'Inactive' : toCaps(c.status);
        c.statusType =
          c.status === 'open' && c.active
            ? 'success'
            : c.status === 'open'
              ? 'inactive'
              : c.status.includes('open')
                ? 'info'
                : 'error';
        c.capacityLabel = toAmountLabel(c.capacity, settings);
        c.localBalanceLabel = toAmountLabel(c.localBalance, settings);
        c.remoteBalanceLabel = toAmountLabel(c.remoteBalance, settings);
      });
      return all;
    },
    get channelBalanceOpenLabel() {
      const { channels, settings } = store;
      const sum = (channels || [])
        .map(c => (c.active ? Number(c.localBalance) : 0))
        .reduce((a, b) => a + b, 0);
      return toAmountLabel(sum, settings);
    },
    get channelBalanceInactiveLabel() {
      const { channels, settings } = store;
      const sum = (channels || [])
        .map(c => (!c.active ? Number(c.localBalance) : 0))
        .reduce((a, b) => a + b, 0);
      return toAmountLabel(sum, settings);
    },
    get channelBalancePendingLabel() {
      const { pendingChannels, settings } = store;
      const sum = (pendingChannels || [])
        .filter(c => c.status.includes('open'))
        .map(c => Number(c.localBalance))
        .reduce((a, b) => a + b, 0);
      return toAmountLabel(sum, settings);
    },
    get channelBalanceClosingLabel() {
      const { pendingChannels, settings } = store;
      const sum = (pendingChannels || [])
        .filter(c => !c.status.includes('open'))
        .map(c => Number(c.localBalance))
        .reduce((a, b) => a + b, 0);
      return toAmountLabel(sum, settings);
    },
    get showChannelAlert() {
      return (store.channels || []).length === 0;
    },
  });
};

export default ComputedChannel;
