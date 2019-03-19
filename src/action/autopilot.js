/**
 * @fileOverview actions related to autopilot, such as toggling
 * whether autopilot should open channels.
 */

import * as log from './log';

class AtplAction {
  constructor(store, ipc, db, notification) {
    this._store = store;
    this._ipc = ipc;
    this._db = db;
    this._notification = notification;
  }

  /**
   * This is called to initialize the GRPC client to autopilot. Once `autopilotReady`
   * is set to true on the store GRPC calls can be made to the client.
   * @return {Promise<undefined>}
   */
  async initAutopilot() {
    await this._sendIpc('lndAtplInit', 'lndAtplReady');
    this._store.autopilotReady = true;
    log.info('GRPC autopilotReady');
    if (this._store.settings.autopilot) {
      const err = await this.setAtplStatus({ enable: true });
      if (err) log.error('Failed to activate autopilot', err);
    }
  }

  /**
   * Toggle whether autopilot is turned on.
   * @return {undefined}
   */
  async toggleAutopilot() {
    const err = await this.setAtplStatus({
      enable: !this._store.settings.autopilot,
    });
    if (err) {
      this._notification.display({
        msg: 'Unable to modify autopilot status.',
        err,
      });
    } else {
      this._store.settings.autopilot = !this._store.settings.autopilot;
      this._db.save();
    }
  }

  /**
   * Set whether autopilot is enabled or disabled.
   * @param {boolean} options.enable Whether autopilot should be enabled.
   * @return {Promise<undefined>}
   */
  async setAtplStatus({ enable }) {
    try {
      await this.sendAutopilotCommand('modifyStatus', {
        enable: enable,
      });
    } catch (err) {
      return err;
    }
  }

  /**
   * Wrapper function to execute calls to the autopilot grpc client.
   * @param  {string} method The autopilot GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  sendAutopilotCommand(method, body) {
    return this._sendIpc('lndAtplRequest', 'lndAtplResponse', method, body);
  }

  //
  // Helper functions
  //

  _sendIpc(event, listen, method, body) {
    listen = method ? `${listen}_${method}` : listen;
    return this._ipc.send(event, listen, { method, body });
  }
}

export default AtplAction;
