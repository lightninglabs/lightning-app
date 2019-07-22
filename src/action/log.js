/**
 * @fileOverview actions for logging to the cli. This module can be regarded as a
 * global singleton and can be imported directly as an ES6 module at the top of
 * other actions for easier use as it stores instances of dependencies in closure
 * variables.
 */

import { MAX_LOG_LENGTH } from '../config';

let _store;
let _ipc;
let _printErrObj;
let _FS;
let _Share;

/**
 * Log an info event e.g. when something relevant but non-critical happens.
 * The data is also sent to the electron main process via IPC to be logged
 * to standard output.
 * @param  {...string|Object} args An info message or object to be logged
 * @return {undefined}
 */
export function info(...args) {
  console.log(...args);
  _ipc && _ipc.send('log', null, args);
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
    pushLogs(
      JSON.stringify(
        _printErrObj ? args[i] : { message: args[i].message },
        null,
        '    '
      )
    );
  }
  pushLogs(''); // newline
  _ipc && _ipc.send('log-error', null, args);
}

/**
 * Gets the location of the LND log file as a string.
 * @param {string} network The network the user's on
 * @return {string}
 */
export function getLogPath(network) {
  if (!_FS) {
    throw new Error('Cannot get log path with no FS in action/log.js');
  }
  const lndDir = _FS.DocumentDirectoryPath;
  return `${lndDir}/logs/bitcoin/${network}/lnd.log`;
}

/**
 * Retrieves the entire LND log file as a string.
 * @return {Promise<string>}
 */
export async function getLogs() {
  if (!_FS) {
    throw new Error('Cannot get logs with no FS in action/log.js');
  }
  return _FS.readFile(getLogPath(_store.network), 'utf8');
}

/**
 * Shares the log file using whatever native share function we have.
 * @return {Promise}
 */
export async function shareLogs() {
  if (!_Share) {
    throw new Error('Cannot share logs with no Share in action/log.js');
  }
  const logs = await getLogs();
  return _Share.share({
    title: 'Lightning App logs',
    message: logs,
  });
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
  constructor(store, ipc, printErrObj = true, FS, Share) {
    _store = store;
    _ipc = ipc;
    _printErrObj = printErrObj;
    _FS = FS;
    _Share = Share;
    _ipc.listen('logs', (event, message) => pushLogs(message));
    _ipc.send('logs-ready', null, true);
  }
}

export default LogAction;
