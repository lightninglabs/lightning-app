const fs = require('fs');
const os = require('os');
const path = require('path');
const grpc = require('grpc');

const GRPC_TIMEOUT = 300000;
const homedir = os.homedir();

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

async function getCredentials(lndDataDir) {
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
  return grpc.credentials.createSsl(lndCert);
}

function getMetadata() {
  const metadata = new grpc.Metadata();
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
  return metadata;
}

module.exports.init = async function({
  ipcMain,
  lndPort,
  lndDataDir,
  macaroonsEnabled,
}) {
  const credentials = await getCredentials(lndDataDir);
  const protoPath = path.join(__dirname, '..', 'assets', 'rpc.proto');
  const { lnrpc } = grpc.load(protoPath);
  let metadata;
  if (macaroonsEnabled) {
    metadata = getMetadata();
  }

  let unlocker;
  ipcMain.on('unlockInit', event => {
    unlocker = new lnrpc.WalletUnlocker(`localhost:${lndPort}`, credentials);
    grpc.waitForClientReady(unlocker, Infinity, err => {
      event.sender.send('unlockReady', { err });
    });
  });

  ipcMain.on('unlockClose', event => {
    unlocker.close();
    event.sender.send('unlockClosed', {});
  });

  let lnd;
  ipcMain.on('lndInit', event => {
    lnd = new lnrpc.Lightning(`localhost:${lndPort}`, credentials);
    grpc.waitForClientReady(lnd, Infinity, err => {
      event.sender.send('lndReady', { err });
    });
  });

  ipcMain.on('lndClose', event => {
    lnd.close();
    event.sender.send('lndClosed', {});
  });

  ipcMain.on('unlockRequest', (event, { method, body }) => {
    const deadline = new Date(new Date().getTime() + GRPC_TIMEOUT);
    const handleResponse = (err, response) => {
      event.sender.send(`unlockResponse_${method}`, { err, response });
    };
    if (metadata) {
      unlocker[method](body, metadata, { deadline }, handleResponse);
    } else {
      unlocker[method](body, { deadline }, handleResponse);
    }
  });

  ipcMain.on('lndRequest', (event, { method, body }) => {
    const deadline = new Date(new Date().getTime() + GRPC_TIMEOUT);
    const handleResponse = (err, response) => {
      event.sender.send(`lndResponse_${method}`, { err, response });
    };
    if (metadata) {
      lnd[method](body, metadata, { deadline }, handleResponse);
    } else {
      lnd[method](body, { deadline }, handleResponse);
    }
  });

  const streams = {};
  ipcMain.on('lndStreamRequest', (event, { method, body }) => {
    let stream;
    if (metadata) {
      stream = lnd[method](metadata, body);
    } else {
      stream = lnd[method](body);
    }
    const send = res => event.sender.send(`lndStreamEvent_${method}`, res);
    stream.on('data', data => send({ event: 'data', data }));
    stream.on('end', () => send({ event: 'end' }));
    stream.on('error', err => send({ event: 'error', err }));
    stream.on('status', data => send({ event: 'status', data }));
    streams[method] = stream;
  });

  ipcMain.on('lndStreamWrite', (event, { method, data }) => {
    const stream = streams[method];
    if (!stream) return;
    stream.write(data);
  });
};
