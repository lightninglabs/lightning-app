/**
 * @fileOverview actions related to autopilot, such as toggling
 * whether autopilot should open channels.
 */

import { ATPL_DELAY } from '../config';
import { poll, checkHttpStatus } from '../helper';
import * as log from './log';

class AtplAction {
  constructor(store, grpc, db, notification) {
    this._store = store;
    this._grpc = grpc;
    this._db = db;
    this._notification = notification;
  }

  /**
   * Initialize autopilot from the stored settings and enable it via grpc
   * depending on if the user has enabled it in the last session. Fetch node
   * scores are fetched from an api to inform channel selection.
   * @return {Promise<undefined>}
   */
  async init() {
    await this.updateNodeScores();
    if (this._store.settings.autopilot) {
      await this._setStatus(true);
    }
    await poll(() => this.updateNodeScores(), ATPL_DELAY);
  }

  /**
   * Toggle whether autopilot is turned on and save user settings if
   * the grpc call was successful.
   * @return {Promise<undefined>}
   */
  async toggle() {
    const newState = !this._store.settings.autopilot;
    const success = await this._setStatus(newState);
    if (success) {
      this._store.settings.autopilot = newState;
      this._db.save();
    }
  }

  /**
   * Set whether autopilot is enabled or disabled.
   * @param {boolean} enable      Whether autopilot should be enabled.
   * @return {Promise<undefined>}
   */
  async _setStatus(enable) {
    try {
      await this._grpc.sendAutopilotCommand('modifyStatus', { enable });
      return true;
    } catch (err) {
      this._notification.display({ msg: 'Error toggling autopilot', err });
    }
  }

  /**
   * Update node scores to get better channels via autopilot.
   * @return {Promise<undefined>}
   */
  async updateNodeScores() {
    try {
      await this._checkNetwork();
      const scores = await this._readNodeScores();
      await this._setNodeScores(scores);
    } catch (err) {
      log.error('Updating autopilot scores failed', err);
    }
  }

  async _checkNetwork() {
    if (!this._store.network) {
      throw new Error('Could not read network');
    }
  }

  async _readNodeScores() {
    const { network, settings } = this._store;
    try {
      settings.nodeScores[network] = await this._fetchNodeScores(network);
      this._db.save();
    } catch (err) {
      log.error('Fetching node scores failed', err);
    }
    return settings.nodeScores[network];
  }

  async _fetchNodeScores(network) {
    const baseUri = 'https://nodes.lightning.computer/availability/v1';
    const uri = `${baseUri}/btc${network === 'testnet' ? 'testnet' : ''}.json`;
    const response = checkHttpStatus(await fetch(uri));
    return this._formatNodesScores((await response.json()).scores);
  }

  _formatNodesScores(jsonScores) {
    return jsonScores.reduce((map, { public_key, score }) => {
      if (typeof public_key !== 'string' || !Number.isInteger(score)) {
        throw new Error('Invalid node score format!');
      }
      map[public_key] = score / 100000000.0;
      return map;
    }, {});
  }

  async _setNodeScores(scores) {
    if (!scores) {
      throw new Error('Node scores are emtpy');
    }
    await this._grpc.sendAutopilotCommand('setScores', {
      heuristic: 'externalscore',
      scores,
    });
  }
}

export default AtplAction;
