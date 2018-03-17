// expose only ipcRenderer to sandbox instead of all node apis
window.ipcRenderer = require('electron').ipcRenderer;
