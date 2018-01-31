const ipcRenderer =
  typeof window !== 'undefined' && window.require('electron').ipcRenderer;

export function info(...args) {
  console.log(...args);
  ipcRenderer && ipcRenderer.send('log', args);
}

export function error(...args) {
  console.error(...args);
  ipcRenderer && ipcRenderer.send('log-error', args);
}

class ActionsLogs {
  constructor(store) {
    ipcRenderer.on('logs', (event, arg) => {
      store.logs.push(arg);
    });
    ipcRenderer.send('logs-ready', true);
  }
}

export default ActionsLogs;
