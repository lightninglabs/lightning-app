const fs = require('fs');
const os = require('os');
const path = require('path');
const grpc = require('grpc');
const cp = require('child_process');

process.env.GRPC_SSL_CIPHER_SUITES =
  'ECDHE-RSA-AES128-GCM-SHA256:' +
  'ECDHE-RSA-AES128-SHA256:' +
  'ECDHE-RSA-AES256-SHA384:' +
  'ECDHE-RSA-AES256-GCM-SHA384:' +
  'ECDHE-ECDSA-AES128-GCM-SHA256:' +
  'ECDHE-ECDSA-AES128-SHA256:' +
  'ECDHE-ECDSA-AES256-SHA384:' +
  'ECDHE-ECDSA-AES256-GCM-SHA384';

async function waitForCertPath(certPath) {
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
  const filename = os.platform() === 'win32' ? `${binName}.exe` : binName;
  const filePath =
    __dirname.indexOf('asar') >= 0
      ? path.join(
          __dirname,
          '..',
          '..',
          'assets',
          'bin',
          os.platform(),
          filename
        )
      : path.join(__dirname, '..', 'assets', 'bin', os.platform(), filename);
  return cp.spawnSync('type', [binName]).status === 0 ? binName : filePath;
}

async function startChildProcess(name, args, logger) {
  return new Promise((resolve, reject) => {
    const processName = getProcessName(name);
    logger.info(`Using ${name} in path ${processName}`);
    const childProcess = cp.spawn(processName, args);
    childProcess.stdout.on('data', data => {
      logger.info(`${processName}: ${data}`);
      resolve(childProcess);
    });
    childProcess.stderr.on('data', data => {
      logger.error(`${processName} Error: ${data}`);
      reject(new Error(data));
    });
    childProcess.on('error', reject);
  });
}

function startBlockingProcess(name, args, logger) {
  return new Promise((resolve, reject) => {
    const processName = getProcessName(name);
    logger.info(`Using ${name} in path ${processName}`);
    const childProcess = cp.spawn(processName, args);
    childProcess.stdout.on('data', data => {
      logger.info(`${processName}: ${data}`);
    });
    childProcess.stderr.on('data', data => {
      logger.error(`${processName} Error: ${data}`);
      reject(new Error(data));
    });
    childProcess.on('exit', resolve);
    childProcess.on('error', reject);
  });
}

module.exports.createGrpcClient = async function({
  global,
  lndPort,
  lndDataDir,
  macaroonsEnabled,
}) {
  const homedir = os.homedir();

  let certPath;
  if (lndDataDir) {
    certPath = path.join(lndDataDir, 'tls.cert');
  } else {
    certPath = {
      darwin: path.join(homedir, 'Library/Application Support/Lnd/tls.cert'),
      linux: path.join(homedir, '.lnd/tls.cert'),
      win32: path.join(homedir, 'AppData', 'Local', 'Lnd', 'tls.cert'),
    }[os.platform()];
  }

  await waitForCertPath(certPath);

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
  lndRestPort,
}) {
  const processName = 'lnd';
  const args = [
    isDev ? '--bitcoin.active' : '',
    isDev ? '--bitcoin.simnet' : '',
    isDev ? '--btcd.rpcuser=kek' : '',
    isDev ? '--btcd.rpcpass=kek' : '',
    isDev ? '--bitcoin.node=btcd' : '--bitcoin.node=neutrino',

    isDev ? '' : '--bitcoin.active',
    isDev ? '' : '--configfile=../lnd.conf',
    isDev ? '' : '--bitcoin.testnet',
    isDev ? '' : '--neutrino.connect=btcd0.lightning.computer:18333',
    isDev ? '' : '--neutrino.connect=127.0.0.1:18333',
    isDev ? '' : '--autopilot.active',

    macaroonsEnabled ? '' : '--no-macaroons',
    lndDataDir ? `--datadir=${lndDataDir}` : '',
    lndDataDir ? `--tlscertpath=${lndDataDir}/tls.cert` : '',
    lndDataDir ? `--tlskeypath=${lndDataDir}/tls.key` : '',
    lndLogDir ? `--logdir=${lndLogDir}` : '',
    lndPort ? `--rpclisten=localhost:${lndPort}` : '',
    lndPeerPort ? `--listen=localhost:${lndPeerPort}` : '',
    lndRestPort ? `--restlisten=localhost:${lndRestPort}` : '',

    '--debuglevel=info',
    '--noencryptwallet',
  ];
  return startChildProcess(processName, args, logger);
};

module.exports.startBtcdProcess = async function({
  isDev,
  logger,
  btcdLogDir,
  btcdDataDir,
  miningAddress,
}) {
  if (!isDev) return; // don't start btcd if neutrino is used
  const processName = 'btcd';
  const args = [
    '--simnet',
    '--txindex',
    '--rpcuser=kek',
    '--rpcpass=kek',
    btcdDataDir ? `--datadir=${btcdDataDir}` : '',
    btcdLogDir ? `--logdir=${btcdLogDir}` : '',
    miningAddress ? `--miningaddr=${miningAddress}` : '',
  ];
  return startChildProcess(processName, args, logger);
};

module.exports.mineBlocks = async function({ blocks, logger }) {
  const processName = 'btcctl';
  const args = [
    '--simnet',
    '--rpcuser=kek',
    '--rpcpass=kek',
    'generate',
    String(blocks),
  ];
  return startBlockingProcess(processName, args, logger);
};
