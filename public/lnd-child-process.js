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

async function waitForCertPath() {
  let intervalId;
  return new Promise(resolve => {
    intervalId = setInterval(() => {
      if (!fs.existsSync(certPath)) return;
      clearInterval(intervalId);
      resolve();
    }, 500);
  });
}

function getProcessName(binName) {
  const filePath = path.join(
    __dirname,
    '..',
    'assets',
    'bin',
    os.platform(),
    os.platform() === 'win32' ? `${binName}.exe` : binName
  );
  return cp.spawnSync('type', [binName]).status === 0 ? binName : filePath;
}

module.exports.createGrpcClient = async function({
  global,
  lndPort,
  macaroonsEnabled,
}) {
  await waitForCertPath();

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
};

module.exports.startLndProcess = async function({
  isDev,
  macaroonsEnabled,
  lndDataDir,
  lndLogDir,
  lndPort,
  lndPeerPort,
  logger,
  sendLog,
}) {
  const lndName = 'lnd';
  const args = [
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
  ];

  return new Promise((resolve, reject) => {
    const processName = getProcessName(lndName);
    logger.info(`Using lnd in path ${processName}`);
    const lndProcess = cp.spawn(processName, args);
    lndProcess.stdout.on('data', data => {
      logger.info(`${lndName}: ${data}`);
      sendLog(`${data}`);
      resolve(lndProcess);
    });
    lndProcess.stderr.on('data', data => {
      logger.error(`${lndName} Error: ${data}`);
      sendLog(`ERROR: ${data}`);
      reject(new Error(data));
    });
  });
};

module.exports.startBtcdProcess = async function({
  isDev,
  logger,
  sendLog,
  miningAddress,
}) {
  if (!isDev) return; // don't start btcd if neutrino is used

  const btcdName = 'btcd';
  const args = [
    '--simnet',
    '--txindex',
    '--rpcuser=kek',
    '--rpcpass=kek',
    miningAddress ? `--miningaddr=${miningAddress}` : '',
  ];

  return new Promise((resolve, reject) => {
    const processName = getProcessName(btcdName);
    logger.info(`Using btcd in path ${processName}`);
    const btcdProcess = cp.spawn(processName, args);
    btcdProcess.stdout.on('data', data => {
      logger.info(`${processName}: ${data}`);
      sendLog(`${data}`);
      resolve(btcdProcess);
    });
    btcdProcess.stderr.on('data', data => {
      logger.error(`${processName} Error: ${data}`);
      sendLog(`ERROR: ${data}`);
      reject(new Error(data));
    });
  });
};
