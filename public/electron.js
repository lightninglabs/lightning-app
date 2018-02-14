const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const ps = require('ps-node');
const log = require('electron-log');
const { PREFIX_NAME, MACAROONS_ENABLED } = require('../src/config');
const { createGrpcClient, startLndProcess } = require('./lnd-child-process');

console.log(`
 ___       ________       ________  ________  ________
|\\  \\     |\\   ___  \\    |\\   __  \\|\\   __  \\|\\   __  \\
\\ \\  \\    \\ \\  \\\\ \\  \\   \\ \\  \\|\\  \\ \\  \\|\\  \\ \\  \\|\\  \\
 \\ \\  \\    \\ \\  \\\\ \\  \\   \\ \\   __  \\ \\   ____\\ \\   ____\\
  \\ \\  \\____\\ \\  \\\\ \\  \\   \\ \\  \\ \\  \\ \\  \\___|\\ \\  \\___|
   \\ \\_______\\ \\__\\\\ \\__\\   \\ \\__\\ \\__\\ \\__\\    \\ \\__\\
    \\|_______|\\|__| \\|__|    \\|__|\\|__|\\|__|     \\|__|


`);

const LND_NAME = 'lnd';
let LND_DATA_DIR = 'lnd_data/lnd';
let LND_LOG_DIR = 'lnd_log';
let LND_PORT = 10009;
let LND_PEER_PORT = 10019;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let lndProcess;

log.transports.console.level = 'info';
log.transports.file.level = 'info';
ipcMain.on('log', (event, arg) => log.info(...arg));
ipcMain.on('log-error', (event, arg) => log.error(...arg));

let logQueue = [];
let logsReady = false;

const sendLog = log => {
  if (win && logsReady) {
    win.webContents.send('logs', log);
  } else {
    logQueue.push(log);
  }
};
const Logger = {
  info: msg => {
    log.info(msg);
    sendLog(msg);
  },
  error: msg => {
    log.error(msg);
    sendLog(`ERROR: ${msg}`);
  },
};
ipcMain.on('logs-ready', () => {
  logQueue.map(line => win && win.webContents.send('logs', line));
  logQueue = [];
  logsReady = true;
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 750, height: 500 });

  if (isDev) {
    win.loadURL('http://localhost:3000');

    // Open the DevTools.
    win.webContents.openDevTools();
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, '..', 'build', 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  //////////////// Lightning App ///////////////////////////

  createGrpcClient({
    global,
    lndPort: LND_PORT,
    macaroonsEnabled: MACAROONS_ENABLED,
  });

  ///////////////////////////////////////////////////
}

//////////////// Lightning App ///////////////////////////

const startLnd = () => {
  lndProcess = startLndProcess({
    lndName: LND_NAME,
    isDev,
    macaroonsEnabled: MACAROONS_ENABLED,
    lndDataDir: LND_DATA_DIR,
    lndLogDir: LND_LOG_DIR,
    lndPort: LND_PORT,
    lndPeerPort: LND_PEER_PORT,
    logger: Logger,
    sendLog,
  });
};

ps.lookup({ command: LND_NAME }, (err, resultList) => {
  if (err) {
    Logger.info(`lnd ps lookup error`, err);
  } else if (resultList) {
    // Increment ports and datadir
    LND_DATA_DIR = `${LND_DATA_DIR}${resultList.length}`;
    LND_PORT = LND_PORT + resultList.length;
    LND_PEER_PORT = LND_PEER_PORT + resultList.length;
    Logger.info(`lnd will run on port ${LND_PORT}, ${LND_DATA_DIR}`);
    startLnd();
  } else {
    startLnd();
  }
});

///////////////////////////////////////////////////

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on('quit', () => {
  lndProcess && lndProcess.kill();
});

app.setAsDefaultProtocolClient(PREFIX_NAME);
app.on('open-url', (event, url) => {
  // event.preventDefault();
  Logger.info(`open-url# ${url}`);
  win && win.webContents.send('open-url', url);
});

process.on('uncaughtException', error => {
  Logger.error('Caught Main Process Error:', error);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
