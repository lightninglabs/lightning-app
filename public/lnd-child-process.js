const fs = require('fs');
const os = require('os');
const path = require('path');
const grpc = require('grpc');
const cp = require('child_process');

const homedir = os.homedir();
const certPath = {
  darwin: path.join(homedir, 'Library/Application Support/Lnd/tls.cert'),
  linux: path.join(homedir, '.lnd/tls.cert'),
  win32: path.join(homedir, 'AppData', 'Local', 'Lnd', 'tls.cert'),
}[os.platform()];

module.exports.createGrpcClient = function({
  global,
  lndPort,
  macaroonsEnabled,
}) {
  this.intervalId = setInterval(() => {
    if (!fs.existsSync(certPath)) return;
    clearInterval(this.intervalId);

    const lndCert = fs.readFileSync(certPath);
    const credentials = grpc.credentials.createSsl(lndCert);
    const { lnrpc } = grpc.load(
      path.join(__dirname, '..', 'assets', 'rpc.proto')
    );
    const connection = new lnrpc.Lightning(`localhost:${lndPort}`, credentials);
    const metadata = new grpc.Metadata();
    if (macaroonsEnabled) {
      const macaroonPath = {
        darwin: path.join(
          homedir,
          'Library/Application Support/Lnd/admin.macaroon'
        ),
        linux: path.join(homedir, '.lnd/admin.macaroon'),
        win32: path.join(homedir, 'AppData', 'Local', 'Lnd', 'admin.macaroon'),
      }[os.platform()];
      const macaroonHex = fs.readFileSync(macaroonPath).toString('hex');
      metadata.add('macaroon', macaroonHex);
      global.metadata = metadata;
    }

    const serverReady = cb => {
      // var deadline = new Date();
      // deadline.setSeconds(deadline.getSeconds() + 5);
      grpc.waitForClientReady(connection, Infinity, cb);
    };
    global.connection = connection;
    global.serverReady = serverReady;
  }, 500);
};

module.exports.startLndProcess = function({
  lndName,
  isDev,
  macaroonsEnabled,
  lndDataDir,
  lndLogDir,
  lndPort,
  lndPeerPort,
  logger,
  sendLog,
}) {
  const lndInfo = {
    name: lndName,
    args: [
      isDev ? '--bitcoin.active' : '',
      isDev ? '--bitcoin.simnet' : '',
      isDev ? '--btcd.rpcuser=kek' : '',
      isDev ? '--btcd.rpcpass=kek' : '',

      isDev ? '' : '--bitcoin.active',
      isDev ? '' : '--neutrino.active',
      isDev ? '' : '--configfile=../lnd.conf',
      isDev ? '' : '--bitcoin.testnet',
      isDev ? '' : '--neutrino.connect=btcd0.lightning.computer:18333',
      isDev ? '' : '--neutrino.connect=127.0.0.1:18333',
      isDev ? '' : '--autopilot.active',

      macaroonsEnabled ? '' : '--no-macaroons',
      lndDataDir ? `--datadir=${lndDataDir}` : '',
      lndLogDir ? `--logdir=${lndLogDir}` : '',
      lndPort ? `--rpclisten=localhost:${lndPort}` : '',
      lndPeerPort ? `--listen=localhost:${lndPeerPort}` : '',

      '--debuglevel=info',
      '--noencryptwallet',
    ],
  };

  const filePath = path.join(
    __dirname,
    '..',
    'assets',
    'bin',
    os.platform(),
    os.platform() === 'win32' ? `${lndName}.exe` : lndName
  );

  let processName;
  let lndProcess;
  try {
    processName =
      cp.spawnSync('type', [lndName]).status === 0 ? lndName : filePath;
    logger.info(`Using lnd in path ${processName}`);
    lndProcess = cp.spawn(processName, lndInfo.args);
    lndProcess.stdout.on('data', data => {
      logger.info(`${lndName}: ${data}`);
      sendLog(`${data}`);
    });
    lndProcess.stderr.on('data', data => {
      logger.error(`${lndName} Error: ${data}`);
      sendLog(`ERROR: ${data}`);
    });
  } catch (error) {
    logger.error(`Caught Error When Starting ${processName}: ${error}`);
  }
  return lndProcess;
};
