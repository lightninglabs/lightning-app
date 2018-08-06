/**
 * @fileOverview a low level action to proxy GRPC api calls to and from lnd
 * over electron's IPC renderer api. This module should not be invokes directly
 * from the UI but rather used within other higher level actions.
 */

import { Duplex } from 'stream';
import * as log from './log';

class GrpcAction {
  constructor(store, ipcRenderer) {
    this._store = store;
    this._ipcRenderer = ipcRenderer;
  }

  //
  // WalletUnlocker grpc client
  //

  /**
   * The first GRPC api that is called to initialize the wallet unlocker.
   * Once `unlockerReady` is set to true on the store GRPC calls can be
   * made to the client.
   * @return {Promise<undefined>}
   */
  async initUnlocker() {
    await this._sendIpc('unlockInit', 'unlockReady');
    log.info('GRPC unlockerReady');
    this._store.unlockerReady = true;
  }

  /**
   * This GRPC api is called after the wallet is unlocked to close the grpc
   * client to lnd before the main lnd client is re-opened
   * @return {Promise<undefined>}
   */
  async closeUnlocker() {
    await this._sendIpc('unlockClose', 'unlockClosed');
    log.info('GRPC unlockerClosed');
  }

  /**
   * Wrapper function to execute calls to the wallet unlocker.
   * @param  {string} method The unlocker GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  async sendUnlockerCommand(method, body) {
    return this._sendIpc('unlockRequest', 'unlockResponse', method, body);
  }

  //
  // Lightning (lnd) grpc client
  //

  /**
   * This is called to initialize the main GRPC client to lnd. Once `lndReady`
   * is set to true on the store GRPC calls can be made to the client.
   * @return {Promise<undefined>}
   */
  async initLnd() {
    await this._sendIpc('lndInit', 'lndReady');
    log.info('GRPC lndReady');
    this._store.lndReady = true;
  }

  /**
   * Closes the main GRPC client to lnd. This should only be called upon exiting
   * the application as api calls need to be throughout the lifetime of the app.
   * @return {Promise<undefined>}
   */
  async closeLnd() {
    await this._sendIpc('lndClose', 'lndClosed');
    log.info('GRPC lndClosed');
  }

  /**
   * Wrapper function to execute calls to the lnd grpc client.
   * @param  {string} method The lnd GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  sendCommand(method, body) {
    return this._sendIpc('lndRequest', 'lndResponse', method, body);
  }

  /**
   * Wrapper function to execute a call to the main process
   * in order to retrieve the user's locale.
   * @param  {string} method The lnd GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  sendLocaleRequest() {
    return this._sendIpc('get-locale', 'locale');
  }

  /**
   * Wrapper function to execute GRPC streaming api calls to lnd. This function
   * proxies data to and from lnd using a duplex stream which is returned.
   * @param  {string} method The lnd GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Duplex}        The duplex stream object instance
   */
  sendStreamCommand(method, body) {
    const self = this;
    const stream = new Duplex({
      write(data) {
        data = JSON.parse(data.toString('utf8'));
        self._ipcRenderer.send('lndStreamWrite', { method, data });
      },
      read() {},
    });
    this._ipcRenderer.on(`lndStreamEvent_${method}`, (e, arg) => {
      stream.emit(arg.event, arg.data || arg.err);
    });
    this._ipcRenderer.send('lndStreamRequest', { method, body });
    return stream;
  }

  //
  // Helper functions
  //

  _sendIpc(event, listen, method, body) {
    return new Promise((resolve, reject) => {
      listen = method ? `${listen}_${method}` : listen;
      this._ipcRenderer.once(listen, (e, arg) => {
        if (arg.err) {
          reject(arg.err);
        } else {
          resolve(arg.response);
        }
      });
      this._ipcRenderer.send(event, { method, body });
    });
  }
}

export default GrpcAction;
