/**
 * @fileOverview actions related to autopilot, such as toggling
 * whether autopilot should open channels.
 */

import { ATPL_UPDATE_DELAY } from '../config';
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
   * depending on if the user has enabled it in the last session.
   * Additionally, poll the bos scores either way.
   * @return {Promise<undefined>}
   */
  async init() {
    await this.updateAutopilotScores();
    if (this._store.settings.autopilot) {
      await this._setStatus(true);
    }
    await poll(() => this.updateAutopilotScores(), ATPL_UPDATE_DELAY);
  }

  /**
   * Toggle whether autopilot is turned on and save user settings if
   * the grpc call was successful.
   * @return {Promise<undefined>}
   */
  async toggle() {
    const success = await this._setStatus(!this._store.settings.autopilot);
    if (success) {
      this._store.settings.autopilot = !this._store.settings.autopilot;
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
   * Update autopilot's channel scores so it knows whom to open channels with.
   * @return {Promise<undefined>}
   */
  async updateAutopilotScores() {
    try {
      const nodeScores = await this.fetchBosScores();
      await this._grpc.sendAutopilotCommand('setScores', {
        heuristic: 'externalscore',
        scores: nodeScores,
      });
    } catch (err) {
      log.error('Updating autopilot scores failed', err);
    }
  }

  /**
   * Fetch bos scores, persist them, and return them in a list.
   * @return {Object}
   */
  async fetchBosScores() {
    const networkStr =
      (await this._getNetwork()) === 'testnet' ? 'testnet' : '';
    try {
      const uri = `https://nodes.lightning.computer/availability/btc${networkStr}.json`;
      const response = checkHttpStatus(await fetch(uri));
      const json = await response.json();
      const scores = this._formatAtplScores(json.scores);
      if (networkStr === '') this._store.settings.atplScores = scores;
      else this._store.settings.atplTestnetScores = scores;
      this._db.save();
      return scores;
    } catch (err) {
      log.error('Failed to fetch bos scores', err);
      let cachedScores =
        networkStr === ''
          ? this._store.settings.atplScores
          : this._store.settings.atplTestnetScores;
      if (cachedScores !== {}) {
        return cachedScores;
      } else {
        throw new Error(
          'Failed to fetch bos scores and no scores are cached',
          err
        );
      }
    }
  }

  _formatAtplScores(jsonScores) {
    let scores = {};
    for (let node of jsonScores) {
      let score = node.score / 100000000.0;
      scores[node.public_key] = score;
    }
    return scores;
  }

  async _getNetwork() {
    const response = await this._grpc.sendCommand('getInfo');
    return response.chains[0].network;
  }
}

export default AtplAction;
