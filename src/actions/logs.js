import store from '../store';
const { ipcRenderer } = window.require('electron');

const consoleOrig = console;
console = {
  log: (...params) => {
    consoleOrig.log(...params);
    ipcRenderer.send('log', params);
  },
  error: (...params) => {
    consoleOrig.log(...params);
    ipcRenderer.send('log-error', params);
  },
};

class ActionsLogs {
  constructor() {
    ipcRenderer.on('logs', (event, arg) => {
      store.logs.push(arg);
    });
    ipcRenderer.send('logs-ready', true);
  }
}

export default new ActionsLogs();
