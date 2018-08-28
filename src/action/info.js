/**
 * @fileOverview the info actions are used to fetch general details about the
 * state of the lnd such as the public key as well as synchronization state and
 * the current block height.
 */

import { observe } from 'mobx';
import { poll } from '../helper';
import * as log from './log';

class InfoAction {
  constructor(store, grpc, nav, notification) {
    this._store = store;
    this._nav = nav;
    this._grpc = grpc;
    this._notification = notification;
  }

  /**
   * Fetch the network info e.g. number of node in the channel graph as a
   * proxy for filter header syncing being completed.
   * @return {Promise<undefined>}
   */
  async getNetworkInfo() {
    try {
      const response = await this._grpc.sendCommand('getNetworkInfo');
      this._store.numNodes = response.num_nodes;
    } catch (err) {
      log.info('No network info yet');
    }
  }

  /**
   * Fetches the current details of the lnd node and sets the corresponding
   * store parameters. This api is polled at the beginning of app initialization
   * until lnd has finished syncing the chain to the connected bitcoin full node.
   * Since fetching filter headers can take a long time during initial sync, we
   * use the number of nodes from the network info api as a proxy if filter
   * headers are finished syncing and autopilot has enough nodes to start.
   * @return {Promise<undefined>}
   */
  async getInfo() {
    try {
      const response = await this._grpc.sendCommand('getInfo');
      this._store.pubKey = response.identity_pubkey;
      this._store.syncedToChain = response.synced_to_chain;
      this._store.blockHeight = response.block_height;
      await this.getNetworkInfo();
      this._store.isSyncing =
        !response.synced_to_chain || this._store.numNodes < 2;
      if (this.startingSyncTimestamp === undefined) {
        this.startingSyncTimestamp = response.best_header_timestamp || 0;
      }
      if (this._store.isSyncing) {
        this._notification.display({ msg: 'Syncing to chain', wait: true });
        log.info(`Syncing to chain ... block height: ${response.block_height}`);
        this._store.percentSynced = this.calcPercentSynced(response);
      }
      return !this._store.isSyncing;
    } catch (err) {
      log.error('Getting node info failed', err);
    }
  }

  /**
   * Poll the getInfo api until isSyncing is false.
   * @return {Promise<undefined>}
   */
  async pollInfo() {
    await poll(() => this.getInfo());
  }

  /**
   * A navigation helper called during the app onboarding process. The loader
   * screen indicating the syncing progress in displayed until syncing has
   * completed `syncedToChain` is set to true. After that the user is taken
   * to the home screen.
   * @return {undefined}
   */
  initLoaderSyncing() {
    if (this._store.syncedToChain) {
      this._nav.goHome();
    } else {
      this._nav.goLoaderSyncing();
      observe(this._store, 'isSyncing', () => this._nav.goHome());
    }
  }

  /**
   * An internal helper function to approximate the current progress while
   * syncing Neutrino to the full node.
   * @param  {Object} response The getInfo's grpc api response
   * @return {number}          The percrentage a number between 0 and 1
   */
  calcPercentSynced(response) {
    const bestHeaderTimestamp = response.best_header_timestamp;
    const currTimestamp = new Date().getTime() / 1000;
    const progressSoFar = bestHeaderTimestamp
      ? bestHeaderTimestamp - this.startingSyncTimestamp
      : 0;
    const totalProgress = currTimestamp - this.startingSyncTimestamp || 0.001;
    const percentSynced = progressSoFar * 1.0 / totalProgress;
    // TODO: display max 0.9 until we have progress for fetching filter headers
    return percentSynced * 0.9;
  }
}

export default InfoAction;
