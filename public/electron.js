const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const os = require('os');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const log = require('electron-log');
const { startLndProcess, startBtcdProcess } = require('./lnd-child-process');
const grcpClient = require('./grpc-client');
const {
  PREFIX_NAME,
  MACAROONS_ENABLED,
  LND_PORT,
  LND_PEER_PORT,
  LND_INIT_DELAY,
  BTCD_MINING_ADDRESS,
} = require('../src/config');

console.log(`
 ___       ________       ________  ________  ________
|\\  \\     |\\   ___  \\    |\\   __  \\|\\   __  \\|\\   __  \\
\\ \\  \\    \\ \\  \\\\ \\  \\   \\ \\  \\|\\  \\ \\  \\|\\  \\ \\  \\|\\  \\
 \\ \\  \\    \\ \\  \\\\ \\  \\   \\ \\   __  \\ \\   ____\\ \\   ____\\
  \\ \\  \\____\\ \\  \\\\ \\  \\   \\ \\  \\ \\  \\ \\  \\___|\\ \\  \\___|
   \\ \\_______\\ \\__\\\\ \\__\\   \\ \\__\\ \\__\\ \\__\\    \\ \\__\\
    \\|_______|\\|__| \\|__|    \\|__|\\|__|\\|__|     \\|__|


`);

const userDataPath = app.getPath('userData');
const lndSettingsDir = path.join(isDev ? 'data' : userDataPath, 'lnd');
const btcdSettingsDir = path.join(isDev ? 'data' : userDataPath, 'btcd');
const lndArgs = process.argv.filter(a => /(bitcoin)|(btcd)|(neutrino)/.test(a));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let locale;
let lndProcess;
let btcdProcess;

log.transports.console.level = 'info';
log.transports.file.level = 'info';
ipcMain.on('log', (event, arg) => log.info(...arg));
ipcMain.on('log-error', (event, arg) => log.error(...arg));
ipcMain.on('get-locale', event => (event.returnValue = locale));

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

  grcpClient.init({
    ipcMain,
    lndSettingsDir,
    lndPort: LND_PORT,
    macaroonsEnabled: MACAROONS_ENABLED,
  });
}

const startLnd = async () => {
  try {
    btcdProcess = await startBtcdProcess({
      isDev,
      logger: Logger,
      btcdSettingsDir,
      miningAddress: BTCD_MINING_ADDRESS,
    });
    lndProcess = await startLndProcess({
      isDev,
      lndSettingsDir,
      macaroonsEnabled: MACAROONS_ENABLED,
      lndPort: LND_PORT,
      lndPeerPort: LND_PEER_PORT,
      logger: Logger,
      lndArgs,
    });
  } catch (err) {
    Logger.error(`Caught Error When Starting lnd: ${err}`);
  }
};

// Check for updates
autoUpdater.on('update-downloaded', () => {
  const opt = {
    type: 'question',
    buttons: ['Install', 'Later'],
    title: 'Update available',
    message: 'An update is available. Restart the app and install?',
  };
  dialog.showMessageBox(win, opt, choice => {
    if (choice !== 0) return;
    setTimeout(() => autoUpdater.quitAndInstall(), 100);
  });
});

function initAutoUpdate() {
  if (isDev) return;
  autoUpdater.checkForUpdates();
  const oneHour = 60 * 60 * 1000;
  setInterval(() => autoUpdater.checkForUpdates(), oneHour);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  locale = app.getLocale();
  initAutoUpdate();
  createWindow();
  initApplicationMenu();
  startLnd();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
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
app.on('open-url', async (event, url) => {
  while (!win) {
    await new Promise(resolve => setTimeout(resolve, LND_INIT_DELAY));
  }
  win && win.webContents.send('open-url', url);
});

process.on('uncaughtException', error => {
  Logger.error('Caught Main Process Error:', error);
});

// Create the Application's main menu
function initApplicationMenu() {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
  ];
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
    // Edit menu
    template[1].submenu.push({ type: 'separator' });
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
