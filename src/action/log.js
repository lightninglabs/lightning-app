/**
 * @fileOverview actions for logging to the cli. This module can be regarded as a
 * global singleton and can be imported directly as an ES6 module at the top of
 * other actions for easier use as it stores instances of dependencies in closure
 * variables.
 */

import { MAX_LOG_LENGTH } from '../config';

let _store;
let _ipcRenderer;

/**
 * Log an info event e.g. when something relevant but non-critical happens.
 * The data is also sent to the electron main process via IPC to be logged
 * to standard output.
 * @param  {...string|Object} args An info message or object to be logged
 * @return {undefined}
 */
export function info(...args) {
  console.log(...args);
  _ipcRenderer && _ipcRenderer.send('log', args);
}

/**
 * Log an error event e.g. when something does not work as planned. Apart
 * from logging the error on the console this also appends the error to the
 * logs which are displayed to the user in the Logs/CLI view.
 * The data is also sent to the electron main process via IPC to be logged
 * to standard output.
 * @param  {...string|Object} args An error message of Error object
 * @return {undefined}
 */
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
