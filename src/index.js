import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const { ipcRenderer } = window.require('electron');
const consoleOrig = console;
console = {
  log: (...params) => {
    consoleOrig.log(...params);
    ipcRenderer.send('log', params);
  },
  info: (...params) => {
    consoleOrig.log(...params);
    ipcRenderer.send('log', params);
  },
  error: (...params) => {
    consoleOrig.log(...params);
    ipcRenderer.send('log', params);
  },
};

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
