import { Store } from '../../../src/store';
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
    store = new Store();
  });

  // TODO: figure out how error handling will work on network error
  describe('ComputedLoaderMsg()', () => {
    it('should work with non-numerical values', () => {
      store.percentSynced = null;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_START);
    });

    it('should work for < 0 percentages', () => {
      store.percentSynced = -1;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_START);
    });

    it('should work for > 1 percentages', () => {
      store.percentSynced = 1.01;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_END);
    });

    it('should work for 1st milestone percentage', () => {
      store.percentSynced = 0.1;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_START);
    });

    it('should work for 2nd milestone percentage', () => {
      store.percentSynced = LOADING_PERCENT_MID;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_MID);
    });

    it('should work for 3rd milestone percentage', () => {
      store.percentSynced = LOADING_PERCENT_END;
      ComputedLoaderMsg(store);
      expect(store.loadingMsg, 'to equal', LOADING_COPY_END);
    });
  });
});
