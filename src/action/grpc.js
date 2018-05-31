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

  async initUnlocker() {
    await this._sendIpc('unlockInit', 'unlockReady');
    log.info('GRPC unlockerReady');
    this._store.unlockerReady = true;
  }

  async closeUnlocker() {
    await this._sendIpc('unlockClose', 'unlockClosed');
    log.info('GRPC unlockerClosed');
  }

  async sendUnlockerCommand(method, body) {
    return this._sendIpc('unlockRequest', 'unlockResponse', method, body);
  }

  //
  // Lightning (lnd) grpc client
  //

  async initLnd() {
    await this._sendIpc('lndInit', 'lndReady');
    log.info('GRPC lndReady');
    this._store.lndReady = true;
  }

  async closeLnd() {
    await this._sendIpc('lndClose', 'lndClosed');
    log.info('GRPC lndClosed');
  }

  sendCommand(method, body) {
    return this._sendIpc('lndRequest', 'lndResponse', method, body);
  }

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
        if (arg.err) reject(arg.err);
        else resolve(arg.response);
      });
      this._ipcRenderer.send(event, { method, body });
    });
  }
}

export default GrpcAction;
