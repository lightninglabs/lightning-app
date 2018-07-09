const os = require('os');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function getProcessName(binName) {
  const filename = os.platform() === 'win32' ? `${binName}.exe` : binName;
  const filePath = __dirname.includes('asar')
    ? path.join(__dirname, '..', '..', 'assets', 'bin', os.platform(), filename)
    : path.join(__dirname, '..', 'assets', 'bin', os.platform(), filename);
  return fs.existsSync(filePath) ? filePath : filename;
}

async function startChildProcess(name, args, logger) {
  return new Promise((resolve, reject) => {
    const processName = getProcessName(name);
    logger.info(`Using ${name} in path ${processName}`);
    const childProcess = cp.spawn(processName, args);
    childProcess.stdout.on('data', data => {
      logger.info(data.toString());
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
      logger.info(data.toString());
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
  lndSettingsDir,
  lndPort,
  lndPeerPort,
  logger,
  lndRestPort,
  lndArgs = [],
}) {
  if (!lndSettingsDir) throw new Error('lndSettingsDir not set!');
  const processName = 'lnd';
  const useNeutrino = !isDev && !lndArgs.length;
  let args = [
    '--bitcoin.active',
    isDev ? '--bitcoin.simnet' : '--bitcoin.testnet',
    isDev ? '--btcd.rpcuser=kek' : '',
    isDev ? '--btcd.rpcpass=kek' : '',
    isDev ? '' : '--autopilot.active',
    useNeutrino ? '--bitcoin.node=neutrino' : '',
    useNeutrino ? '--neutrino.connect=btcd0.lightning.engineering' : '',
    useNeutrino ? '--neutrino.connect=127.0.0.1:18333' : '',

    macaroonsEnabled ? '' : '--no-macaroons',
    `--configfile=${path.join(lndSettingsDir, 'lnd.conf')}`,
    `--datadir=${path.join(lndSettingsDir, 'data')}`,
    `--logdir=${path.join(lndSettingsDir, 'logs')}`,
    `--tlscertpath=${path.join(lndSettingsDir, 'tls.cert')}`,
    `--tlskeypath=${path.join(lndSettingsDir, 'tls.key')}`,
    lndPort ? `--rpclisten=localhost:${lndPort}` : '',
    lndPeerPort ? `--listen=localhost:${lndPeerPort}` : '',
    lndRestPort ? `--restlisten=localhost:${lndRestPort}` : '',

    '--debuglevel=info',
  ];
  args = args.concat(lndArgs);
  return startChildProcess(processName, args, logger);
};

module.exports.startBtcdProcess = async function({
  isDev,
  logger,
  btcdSettingsDir,
  miningAddress,
}) {
  if (!isDev) return; // don't start btcd if neutrino is used
  const processName = 'btcd';
  const args = [
    '--simnet',
    '--txindex',
    '--rpcuser=kek',
    '--rpcpass=kek',
    btcdSettingsDir ? `--datadir=${path.join(btcdSettingsDir, 'data')}` : '',
    btcdSettingsDir ? `--logdir=${path.join(btcdSettingsDir, 'logs')}` : '',
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
