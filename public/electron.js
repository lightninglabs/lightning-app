const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const fs = require('fs');
const grpc = require('grpc');
const ps = require('ps-node');
const os = require('os');
const cp = require('child_process');
const log = require('electron-log');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let lndProcess;

log.transports.console.level = 'info';
log.transports.file.level = 'info';
ipcMain.on('log', (event, arg) => log.info(...arg));
ipcMain.on('log-error', (event, arg) => log.error(...arg));

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
  const homedir = os.homedir();
  const certPath = {
    darwin: path.join(homedir, 'Library/Application Support/Lnd/tls.cert'),
    linux: path.join(homedir, '.lnd/tls.cert'),
    win32: path.join(homedir, 'AppData', 'Local', 'Lnd', 'tls.cert'),
  }[os.platform()];
  const macaroonPath = {
    darwin: path.join(
      homedir,
      'Library/Application Support/Lnd/admin.macaroon'
    ),
    linux: path.join(homedir, '.lnd/admin.macaroon'),
    win32: path.join(homedir, 'AppData', 'Local', 'Lnd', 'admin.macaroon'),
  }[os.platform()];
  this.intervalId = setInterval(() => {
    if (fs.existsSync(certPath)) {
      clearInterval(this.intervalId);
      const lndCert = fs.readFileSync(certPath);
      const credentials = grpc.credentials.createSsl(lndCert);
      const { lnrpc } = grpc.load(
        path.join(__dirname, '..', 'assets', 'rpc.proto')
      );
      const connection = new lnrpc.Lightning('localhost:10009', credentials);
      const metadata = new grpc.Metadata();
      const macaroonHex = fs.readFileSync(macaroonPath).toString('hex');
      metadata.add('macaroon', macaroonHex);
      const serverReady = cb => {
        // var deadline = new Date();
        // deadline.setSeconds(deadline.getSeconds() + 5);
        grpc.waitForClientReady(connection, Infinity, cb);
      };
      global.connection = connection;
      global.metadata = metadata;
      global.serverReady = serverReady;
    }
  }, 500);
  ///////////////////////////////////////////////////
}

//////////////// Lightning App ///////////////////////////
const lndInfo = {
  name: 'lnd',
  args: [
    isDev && '--bitcoin.active',
    isDev && '--bitcoin.simnet',
    isDev && '--bitcoin.rpcuser=lnd',
    isDev && '--bitcoin.rpcpass=lnd',

    isDev ? '' : '--bitcoin.active',
    isDev ? '' : '--neutrino.active',
    isDev ? '' : '--configfile=../lnd.conf',
    isDev ? '' : '--bitcoin.testnet',
    isDev ? '' : '--neutrino.connect=btcd0.lightning.computer:18333',
    isDev ? '' : '--neutrino.connect=127.0.0.1:18333',
    isDev ? '' : '--debuglevel=info',
    isDev ? '' : '--autopilot.active',
    // '--no-macaroons',
    '--noencryptwallet',
  ],
};
ps.lookup({ command: lndInfo.name }, (err, resultList) => {
  if (err || (resultList && resultList[0])) {
    log.info(`lnd Already Running`);
  } else {
    const filePath = path.join(
      __dirname,
      '..',
      'assets',
      'bin',
      os.platform(),
      os.platform() === 'win32' ? `${lndInfo.name}.exe` : lndInfo.name
    );
    // const filePath = '/Users/kevinejohn/go/bin/lnd';

    let processName;
    let logQueue = [];
    let logsReady = false;
    const sendLog = log => {
      if (win && logsReady) {
        win.webContents.send('logs', log);
      } else {
        logQueue.push(log);
      }
    };
    ipcMain.on('logs-ready', () => {
      logQueue.map(line => win && win.webContents.send('logs', line));
      logQueue = [];
      logsReady = true;
    });

    try {
      processName = cp.spawnSync('type', [lndInfo.name]).status === 0
        ? lndInfo.name
        : filePath;
      log.info(`Using lnd in path ${processName}`);
      lndProcess = cp.spawn(processName, lndInfo.args);
      lndProcess.stdout.on('data', data => {
        log.info(`${lndInfo.name}: ${data}`);
        sendLog(`${data}`);
      });
      lndProcess.stderr.on('data', data => {
        log.error(`${lndInfo.name} Error: ${data}`);
        sendLog(`ERROR: ${data}`);
      });
    } catch (error) {
      log.error(`Caught Error When Starting ${processName}: ${error}`);
    }
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

app.setAsDefaultProtocolClient('lighting');
app.on('open-url', (event, url) => {
  // event.preventDefault();
  log.info(`open-url# ${url}`);
});

process.on('uncaughtException', error => {
  log.error('Caught Main Process Error:', error);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
