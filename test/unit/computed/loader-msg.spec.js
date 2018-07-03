import { observable, useStrict } from 'mobx';
import ComputedLoaderMsg from '../../../src/computed/loader-msg';
import {
  LOADING_COPY_START,
  LOADING_COPY_MID,
  LOADING_COPY_END,
  LOADING_PERCENT_MID,
  LOADING_PERCENT_END,
} from '../../../src/computed/loader-msg';

describe('Computed Loader Msg Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      percentSynced: 0,
    });
  });

  // TODO: figure out how error handling will work on network error
  describe('ComputedLoaderMsg()', () => {
    it('should work with non-numerical values', () => {
      store.percentSynced = null;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_START);
    });

    it('should work for < 0 and > 100 percentages', () => {
      store.percentSynced = -1;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_START);
      store.percentSynced = 101;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_END);
    });

    it('should work for each milestone percentage', () => {
      store.percentSynced = 10;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_START);
      store.percentSynced = LOADING_PERCENT_MID;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_MID);
      store.percentSynced = LOADING_PERCENT_END;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_END);
    });
  });
});
