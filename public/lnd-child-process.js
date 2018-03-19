const os = require('os');
const path = require('path');
const cp = require('child_process');

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
