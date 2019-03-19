/**
 * @fileOverview actions related to autopilot, such as toggling
 * whether autopilot should open channels.
 */

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
   * @return {Promise<undefined>}
   */
  async init() {
    if (this._store.settings.autopilot) {
      await this._setStatus(true);
    }
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
}

export default AtplAction;
