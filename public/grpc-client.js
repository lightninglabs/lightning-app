const fs = require('fs');
const path = require('path');
const grpc = require('grpc');

const GRPC_TIMEOUT = 300000;

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

async function getCredentials(lndSettingsDir) {
  let certPath = path.join(lndSettingsDir, 'tls.cert');
  await waitForCertPath(certPath);
  const lndCert = fs.readFileSync(certPath);
  return grpc.credentials.createSsl(lndCert);
}

function getMetadata(lndSettingsDir) {
  const metadata = new grpc.Metadata();
  const macaroonPath = path.join(lndSettingsDir, 'admin.macaroon');
  const macaroonHex = fs.readFileSync(macaroonPath).toString('hex');
  metadata.add('macaroon', macaroonHex);
  return metadata;
}

module.exports.init = async function({
  ipcMain,
  lndPort,
  lndSettingsDir,
  locale,
  macaroonsEnabled,
}) {
  let credentials;
  let protoPath;
  let metadata;
  let lnrpc;
  let unlocker;
  let lnd;

  ipcMain.on('get-locale', event => {
    event.sender.send('locale', { response: { locale } });
  });

  ipcMain.on('unlockInit', async event => {
    credentials = await getCredentials(lndSettingsDir);
    protoPath = path.join(__dirname, '..', 'assets', 'rpc.proto');
    lnrpc = grpc.load(protoPath).lnrpc;
    if (macaroonsEnabled) {
      metadata = getMetadata(lndSettingsDir);
    }
    unlocker = new lnrpc.WalletUnlocker(`localhost:${lndPort}`, credentials);
    grpc.waitForClientReady(unlocker, Infinity, err => {
      event.sender.send('unlockReady', { err });
    });
  });

  ipcMain.on('unlockClose', event => {
    unlocker.close();
    event.sender.send('unlockClosed', {});
  });

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
