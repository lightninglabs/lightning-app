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
      p.sort((a, b) =>
        a.status > b.status ? -1 : a.status < b.status ? 1 : 0
      );
      let all = [].concat(c, p, cl);
      all.forEach((c, i) => {
        c.key = String(i);
        c.statusLabel =
          c.status === 'open' && !c.active ? 'Inactive' : toCaps(c.status);
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
    get channelBalanceOpenSatoshis() {
      return (store.channels || [])
        .filter(c => c.active)
        .map(c => c.localBalance + c.commitFee)
        .reduce((a, b) => a + b, 0);
    },
    get channelBalanceOpenLabel() {
      const { channelBalanceOpenSatoshis, settings } = store;
      return toAmountLabel(channelBalanceOpenSatoshis, settings);
    },
    get channelBalanceInactiveSatoshis() {
      return (store.channels || [])
        .filter(c => !c.active)
        .map(c => c.localBalance + c.commitFee)
        .reduce((a, b) => a + b, 0);
    },
    get channelBalanceInactiveLabel() {
      const { channelBalanceInactiveSatoshis, settings } = store;
      return toAmountLabel(channelBalanceInactiveSatoshis, settings);
    },
    get channelBalancePendingSatoshis() {
      return (store.pendingChannels || [])
        .filter(c => c.status.includes('open'))
        .map(c => c.localBalance + c.commitFee)
        .reduce((a, b) => a + b, 0);
    },
    get channelBalancePendingLabel() {
      const { channelBalancePendingSatoshis, settings } = store;
      return toAmountLabel(channelBalancePendingSatoshis, settings);
    },
    get channelBalanceClosingSatoshis() {
      return (store.pendingChannels || [])
        .filter(c => !c.status.includes('open'))
        .map(c => c.localBalance)
        .reduce((a, b) => a + b, 0);
    },
    get channelBalanceClosingLabel() {
      const { channelBalanceClosingSatoshis, settings } = store;
      return toAmountLabel(channelBalanceClosingSatoshis, settings);
    },
    get channelStatus() {
      const {
        channelBalanceOpenSatoshis: opened,
        channelBalanceInactiveSatoshis: inactive,
        channelBalancePendingSatoshis: pending,
      } = store;
      return opened
        ? 'success'
        : inactive
        ? 'inactive'
        : pending
        ? 'info'
        : 'error';
    },
  });
};

export default ComputedChannel;
