const { ipcRenderer } = window.require('electron');

const consoleOrig = console;
/* eslint-disable no-global-assign */
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
/* eslint-enable no-global-assign */

class ActionsLogs {
  constructor(store) {
    ipcRenderer.on('logs', (event, arg) => {
      store.logs.push(arg);
    });
    ipcRenderer.send('logs-ready', true);
  }
}

export default ActionsLogs;
