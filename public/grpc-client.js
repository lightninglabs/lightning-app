const fs = require('fs');
const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

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

function getMacaroonCreds(lndSettingsDir, network) {
  return grpc.credentials.createFromMetadataGenerator((args, callback) => {
    const metadata = new grpc.Metadata();
    const macaroonPath = path.join(
      lndSettingsDir,
      `data/chain/bitcoin/${network}/admin.macaroon`
    );
    const macaroonHex = fs.readFileSync(macaroonPath).toString('hex');
    metadata.add('macaroon', macaroonHex);
    callback(null, metadata);
  });
}

module.exports.init = async function({
  ipcMain,
  lndPort,
  lndSettingsDir,
  network,
}) {
  let credentials;
  let protoPath;
  let lnrpc;
  let unlocker;
  let lnd;
  let autopilot;
  const protoOptions = {
    keepCase: false,
    longs: Number,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  ipcMain.on('unlockInit', async event => {
    credentials = await getCredentials(lndSettingsDir);
    protoPath = path.join(__dirname, '..', 'assets', 'rpc.proto');
    const packageDef = protoLoader.loadSync(protoPath, protoOptions);
    lnrpc = grpc.loadPackageDefinition(packageDef).lnrpc;
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
    const macaroonCreds = getMacaroonCreds(lndSettingsDir, network);
    credentials = grpc.credentials.combineChannelCredentials(
      credentials,
      macaroonCreds
    );
    lnd = new lnrpc.Lightning(`localhost:${lndPort}`, credentials);
    grpc.waitForClientReady(lnd, Infinity, err => {
      event.sender.send('lndReady', { err });
    });
  });

  ipcMain.on('lndAtplInit', async event => {
    const atplProto = path.join(__dirname, '..', 'assets', 'autopilot.proto');
    const packageDef = protoLoader.loadSync(atplProto, protoOptions);
    let autopilotRpc = grpc.loadPackageDefinition(packageDef).autopilotrpc;
    autopilot = new autopilotRpc.Autopilot(`localhost:${lndPort}`, credentials);
    grpc.waitForClientReady(autopilot, Infinity, err => {
      event.sender.send('lndAtplReady', { err });
    });
  });

  ipcMain.on('lndClose', event => {
    lnd.close();
    event.sender.send('lndClosed', {});
  });

  ipcMain.on('unlockRequest', (event, { method, body = {} }) => {
    const handleResponse = (err, response) => {
      event.sender.send(`unlockResponse_${method}`, { err, response });
    };
    unlocker[method](body, handleResponse);
  });

  ipcMain.on('lndRequest', (event, { method, body = {} }) => {
    const handleResponse = (err, response) => {
      event.sender.send(`lndResponse_${method}`, { err, response });
    };
    lnd[method](body, handleResponse);
  });

  ipcMain.on('lndAtplRequest', (event, { method, body = {} }) => {
    const handleResponse = (err, response) => {
      event.sender.send(`lndAtplResponse_${method}`, { err, response });
    };
    autopilot[method](body, handleResponse);
  });

  const streams = {};
  ipcMain.on('lndStreamRequest', (event, { method, body = {} }) => {
    let stream;
    stream = lnd[method](body);
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
