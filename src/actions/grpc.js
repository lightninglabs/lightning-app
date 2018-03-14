import * as log from './logs';

class ActionsGrpc {
  constructor(store, ipcRenderer) {
    this._store = store;
    this._ipcRenderer = ipcRenderer;
  }

  async initUnlocker() {
    await this._sendIpc('unlockInit', 'unlockReady');
    log.info('GRPC unlockerReady');
    this._store.unlockerReady = true;
  }

  async sendUnlockerCommand(method, body) {
    return this._sendIpc('unlockRequest', 'unlockResponse', method, body);
  }

  async initLnd() {
    await this._sendIpc('lndInit', 'lndReady');
    log.info('GRPC lndReady');
    this._store.lndReady = true;
  }

  sendCommand(method, body) {
    return this._sendIpc('lndRequest', 'lndResponse', method, body);
  }

  sendStreamCommand(method, body) {
    return this._sendIpc('lndStreamRequest', 'lndStreamResponse', method, body);
  }

  _sendIpc(event, listen, method, body) {
    return new Promise((resolve, reject) => {
      listen = method ? `${listen}_${method}` : listen;
      this._ipcRenderer.on(listen, (e, arg) => {
        if (arg.err) {
          log.error('GRPC: Error from method', method, arg.err);
          return reject(arg.err);
        }
        resolve(arg.response);
      });
      this._ipcRenderer.send(event, { method, body });
    });
  }
}

export default ActionsGrpc;
