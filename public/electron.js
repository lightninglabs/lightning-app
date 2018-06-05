const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const os = require('os');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const ps = require('ps-node');
const log = require('electron-log');
const { PREFIX_NAME, MACAROONS_ENABLED } = require('../src/config');
const { startLndProcess, startBtcdProcess } = require('./lnd-child-process');
const grcpClient = require('./grpc-client');

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
const LND_DATA_DIR = 'data/lnd_data';
const LND_LOG_DIR = 'data/lnd_log';
const BTCD_DATA_DIR = 'data/btcd_data';
const BTCD_LOG_DIR = 'data/btcd_log';
const BTCD_MINING_ADDRESS = 'rfu4i1Mo2NF7TQsN9bMVLFSojSzcyQCEH5';
const LND_PORT = 10009;
const LND_PEER_PORT = 10019;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let lndProcess;
let btcdProcess;

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
  const options = {
    width: 880,
    height: 635,
    backgroundColor: '#57038D',
    icon: path.join(
      __dirname,
      '..',
      'assets',
      'app-icon',
      'desktop' + ({ darwin: '.icns', win32: '.ico' }[os.platform()] || '.png')
    ),
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  };
  if (isDev) {
    // Add width for dev tools
    options.width += 500;
    win = new BrowserWindow(options);
    win.loadURL('http://localhost:3000');
    // Open the DevTools.
    win.webContents.openDevTools();
  } else {
    win = new BrowserWindow(options);
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

  grcpClient.init({
    ipcMain,
    lndPort: LND_PORT,
    lndDataDir: LND_DATA_DIR,
    macaroonsEnabled: MACAROONS_ENABLED,
  });

  ///////////////////////////////////////////////////
}

//////////////// Lightning App ///////////////////////////

const startLnd = async () => {
  try {
    btcdProcess = await startBtcdProcess({
      isDev,
      logger: Logger,
      btcdLogDir: BTCD_LOG_DIR,
      btcdDataDir: BTCD_DATA_DIR,
      miningAddress: BTCD_MINING_ADDRESS,
    });
    lndProcess = await startLndProcess({
      isDev,
      macaroonsEnabled: MACAROONS_ENABLED,
      lndDataDir: LND_DATA_DIR,
      lndLogDir: LND_LOG_DIR,
      lndPort: LND_PORT,
      lndPeerPort: LND_PEER_PORT,
      logger: Logger,
    });
  } catch (err) {
    Logger.error(`Caught Error When Starting ${LND_NAME}: ${err}`);
  }
};

ps.lookup({ command: LND_NAME }, (err, resultList) => {
  if (err) {
    Logger.info(`lnd ps lookup error`, err);
  } else if (resultList) {
    Logger.info(`lnd will run on port ${LND_PORT}, ${LND_DATA_DIR}`);
    startLnd();
  } else {
    startLnd();
  }
});

///////////////////////////////////////////////////

// Check for updates
autoUpdater.on('update-downloaded', () => {
  const opt = {
    type: 'question',
    buttons: ['Install', 'Later'],
    title: 'Update available',
    message: 'Restart the app and install the update?',
  };
  dialog.showMessageBox(opt, choice => {
    if (choice !== 0) return;
    setTimeout(() => autoUpdater.quitAndInstall(), 100);
  });
});

function initAutoUpdate() {
  const oneHour = 60 * 60 * 1000;
  setInterval(() => autoUpdater.checkForUpdates(), oneHour);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  initAutoUpdate();
  createWindow();
});

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
  btcdProcess && btcdProcess.kill();
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
