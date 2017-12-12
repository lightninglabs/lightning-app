import store from '../store';
const { ipcRenderer } = window.require('electron');

class ActionsLogs {
  constructor() {
    ipcRenderer.on('logs', (event, arg) => {
      store.logs.push(arg);
    });
    ipcRenderer.send('logs-ready', true);
  }
}

export default new ActionsLogs();
