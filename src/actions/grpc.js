import * as log from './logs';

class ActionsGrpc {
  constructor(store, ipcRenderer) {
    this._store = store;
    this._ipcRenderer = ipcRenderer;
  }

  initUnlocker() {
    return new Promise((resolve, reject) => {
      this._ipcRenderer.on('unlockReady', (event, err) => {
        if (err) {
          log.error('GRPC: unlocker init failed', err);
          return reject(err);
        }
        log.info('GRPC unlockerReady');
        this._store.unlockerReady = true;
        resolve();
      });
      this._ipcRenderer.send('unlockInit');
    });
  }

  sendUnlockerCommand(method, body) {
    return new Promise((resolve, reject) => {
      this._ipcRenderer.on(`unlockResponse_${method}`, (event, arg) => {
        if (arg.err) {
          log.error('GRPC: Error from method', method, arg.err);
          return reject(arg.err);
        }
        resolve(arg.response);
      });
      this._ipcRenderer.send('unlockRequest', { method, body });
    });
  }

  initLnd() {
    return new Promise((resolve, reject) => {
      this._ipcRenderer.on('lndReady', (event, err) => {
        if (err) {
          log.error('GRPC: lnd init failed', err);
          return reject(err);
        }
        log.info('GRPC lndReady');
        this._store.lndReady = true;
        resolve();
      });
      this._ipcRenderer.send('lndInit');
    });
  }

  sendCommand(method, body) {
    return new Promise((resolve, reject) => {
      this._ipcRenderer.on(`lndResponse_${method}`, (event, arg) => {
        if (arg.err) {
          log.error('GRPC: Error from method', method, arg.err);
          return reject(arg.err);
        }
        resolve(arg.response);
      });
      this._ipcRenderer.send('lndRequest', { method, body });
    });
  }

  sendStreamCommand(method, body) {
    return new Promise((resolve, reject) => {
      this._ipcRenderer.on(`lndStreamResponse_${method}`, (event, arg) => {
        if (arg.err) {
          log.error('GRPC: Error from stream method', method, arg.err);
          return reject(arg.err);
        }
        resolve(arg.response);
      });
      this._ipcRenderer.send('lndStreamRequest', { method, body });
    });
  }
}

export default ActionsGrpc;
