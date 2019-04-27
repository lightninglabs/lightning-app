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
      logger.info(`${name}: ${data}`);
      resolve(childProcess);
    });
    childProcess.stderr.on('data', data => {
      logger.error(`${name} Error: ${data}`);
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
      logger.info(`${name}: ${data}`);
    });
    childProcess.stderr.on('data', data => {
      logger.error(`${name} Error: ${data}`);
      reject(new Error(data));
    });
    childProcess.on('exit', resolve);
    childProcess.on('error', reject);
  });
}

module.exports.startLndProcess = async function({
  isDev,
  lndSettingsDir,
  lndPort,
  lndPeerPort,
  logger,
  lndRestPort,
  lndProfilingPort,
  lndArgs = [],
}) {
  if (!lndSettingsDir) throw new Error('lndSettingsDir not set!');
  const processName = 'lnd';
  let args = [
    '--bitcoin.active',
    '--debuglevel=info',
    `--lnddir=${lndSettingsDir}`,
    `--routing.assumechanvalid`,
    '--historicalsyncinterval=20m',
    '--autopilot.private',
    '--autopilot.minconfs=0',
    '--autopilot.allocation=1.0',
    '--autopilot.heuristic=externalscore:0.95',
    '--autopilot.heuristic=preferential:0.05',
    lndPort ? `--rpclisten=localhost:${lndPort}` : '',
    lndPeerPort ? `--listen=localhost:${lndPeerPort}` : '',
    lndRestPort ? `--restlisten=localhost:${lndRestPort}` : '',
    lndProfilingPort ? `--profile=${lndProfilingPort}` : '',
  ];
  // set development or production settings
  if (isDev) {
    args = args.concat([
      '--bitcoin.simnet',
      '--bitcoin.node=neutrino',
      '--neutrino.connect=127.0.0.1:18555',
    ]);
  }
  // set default production settings if no custom flags
  if (!isDev && !lndArgs.length) {
    args = args.concat([
      '--bitcoin.mainnet',
      '--bitcoin.node=neutrino',
      '--neutrino.connect=165.227.7.29',
      '--neutrino.connect=dev.conner.money',
      '--neutrino.feeurl=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json',
    ]);
  }
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
