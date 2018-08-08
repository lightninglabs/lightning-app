/**
 * @fileOverview computed values that are used in loader UI components.
 */

import { computed, extendObservable } from 'mobx';

const ComputedLoaderMsg = store => {
  extendObservable(store, {
    loadingMsg: computed(() => {
      const { percentSynced: percent } = store;
      return getLoadingMsg(percent);
    }),
  });
};

export const LOADING_COPY_START = 'Loading network...';
export const LOADING_COPY_MID = 'Almost done...';
export const LOADING_COPY_END = 'Just a few seconds...';
export const LOADING_PERCENT_MID = 0.5;
export const LOADING_PERCENT_END = 0.95;

/**
 * Retrieve the loading message corresponding to the percent
 * @param  {number} percent The percentage the network is synced.
 * @return {string}         The message corresponding to the percent.
 */
const getLoadingMsg = percent => {
  percent = Number(percent);
  if (isNaN(percent)) {
    percent = 0;
  } else if (percent < 0) {
    percent = 0;
  } else if (percent > 1) {
    percent = 1;
  }
  if (percent < LOADING_PERCENT_MID) {
    return LOADING_COPY_START;
  } else if (percent < LOADING_PERCENT_END) {
    return LOADING_COPY_MID;
  } else {
    return LOADING_COPY_END;
  }
};

export default ComputedLoaderMsg;
