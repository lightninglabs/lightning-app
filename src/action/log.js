import { MAX_LOG_LENGTH } from '../config';

let _ipcRenderer;

export function info(...args) {
  console.log(...args);
  _ipcRenderer && _ipcRenderer.send('log', args);
}

export function error(...args) {
  console.error(...args);
  _ipcRenderer && _ipcRenderer.send('log-error', args);
}

class LogAction {
  constructor(store, ipcRenderer) {
    _ipcRenderer = ipcRenderer;
    _ipcRenderer.on('logs', (event, arg) => {
      store.logs.push(arg);
      if (store.logs.length > MAX_LOG_LENGTH) {
        store.logs.splice(0, store.logs.length - MAX_LOG_LENGTH);
      }
    });
    _ipcRenderer.send('logs-ready', true);
  }
}

export default LogAction;
