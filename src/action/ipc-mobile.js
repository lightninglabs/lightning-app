/**
 * @fileOverview a low level action to wrap communication to the lnd react native
 * module on mobile in order to provide a platform independant IPC api.
 */

class IpcAction {
  constructor(grpc) {
    this._grpc = grpc;
  }

  /**
   * A wrapper around electron's ipcRenderer send api that can be
   * reused wherever IPC to the main process is necessary.
   * @param  {string} event   The event name the main process listens to
   * @param  {string} listen  (optional) The response event name this process listens to
   * @param  {*}      payload The data sent over IPC
   * @return {Promise<Object>}
   */
  send() {
    return Promise.resolve(); // not used on mobile
  }

  /**
   * A wrapper around electron's ipcRenderer listen api that can be
   * reused wherever listening to IPC from the main process is necessary.
   * @param  {string}   event    The event name this process listens to
   * @param  {Function} callback The event handler for incoming data
   * @return {undefined}
   */
  listen(event, callback) {
    this._grpc._lndEvent.addListener(event, data => callback(event, data));
  }
}

export default IpcAction;
