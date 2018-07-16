/**
 * @fileOverview exposes only required apis to rendering process to minimize attack surface
 */

const _ipcRenderer = require('electron').ipcRenderer;

const filter = event => {
  if (!/^(lnd)|(unlock)[a-zA-Z_]{20}$/.test(event)) {
    throw new Error('Invalid IPC');
  }
  return event;
};

window.ipcRenderer = {
  send: (event, data) => {
    _ipcRenderer.send(filter(event), data);
  },
  on: (event, callback) => {
    _ipcRenderer.on(filter(event), callback);
  },
  once: (event, callback) => {
    _ipcRenderer.once(filter(event), callback);
  },
};
