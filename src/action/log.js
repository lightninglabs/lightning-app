import { MAX_LOG_LENGTH } from '../config';

let _store;
let _ipcRenderer;

export function info(...args) {
  console.log(...args);
  _ipcRenderer && _ipcRenderer.send('log', args);
}

export function error(...args) {
  console.error(...args);
  pushLogs(''); // newline
  pushLogs(`ERROR: ${args[0]}`);
  for (let i = 1; i < args.length; i++) {
    pushLogs(JSON.stringify(args[i], null, '    '));
  }
  pushLogs(''); // newline
  _ipcRenderer && _ipcRenderer.send('log-error', args);
}

function pushLogs(message) {
  if (!_store) return;
  _store.logs += '\n' + message.replace(/\s+$/, '');
  const len = _store.logs.length;
  if (len > MAX_LOG_LENGTH) {
    _store.logs = _store.logs.substring(len - MAX_LOG_LENGTH, len);
  }
}

class LogAction {
  constructor(store, ipcRenderer) {
    _store = store;
    _ipcRenderer = ipcRenderer;
    _ipcRenderer.on('logs', (event, message) => pushLogs(message));
    _ipcRenderer.send('logs-ready', true);
  }
}

export default LogAction;
