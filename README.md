Lightning [![Build Status](https://travis-ci.org/lightninglabs/lightning-app.svg?branch=master)](https://travis-ci.org/lightninglabs/lightning-app)
==========

An easy-to-use cross platform lightning wallet

![Screenshot](https://github.com/lightninglabs/lightning-app/blob/5f2620d1e99ed1372985fec2063066236e4c16d9/assets/screenshot.png)

**N.B. This is still early technology and there’s a risk of losing all of your funds. We recommend not putting in more money than you are willing to lose.**

### Getting Started

The app comes for two threat models:

1. *Pocket Money:* prebuilt and signed [releases](https://github.com/lightninglabs/lightning-app/releases) with auto update (recommended for most users).

2. *Tin Foil Hat:* if you'd rather build it yourself and do without auto updates, see the instructions below.

### Contributing

See the `ToDo (next release)` column on our [project board](https://github.com/lightninglabs/lightning-app/projects/1?fullscreen=true). Issues that are easy to pick up for outside contributors are labeled `help wanted`.

### Developing Locally

To build the mobile app locally, see the [README](https://github.com/lightninglabs/lightning-app/blob/master/mobile/README.md) in the `/mobile` directory for instructions.

To build the desktop app locally follow the instructions below:

#### Install lnd
We will use `lnd` to make GRPC calls from the ReactJS environment
```
git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
cd $GOPATH/src/github.com/lightningnetwork/lnd
make && make install tags="experimental autopilotrpc signrpc walletrpc chainrpc invoicesrpc routerrpc"
```
If you have any issues with this step, make sure to review the [Preliminaries to installing LND](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md#preliminaries)

#### Install btcd
We will use `btcd` as the backend operating mode
```
git clone https://github.com/btcsuite/btcd $GOPATH/src/github.com/btcsuite/btcd
cd $GOPATH/src/github.com/btcsuite/btcd
GO111MODULE=on go install -v . ./cmd/...
```

#### Set up & run
Cloning this git repo `git clone https://github.com/lightninglabs/lightning-app` and from the project root folder run the following commands:
```
npm install

npm test
```

To start the app in development mode (simnet):
```
npm run electron-dev
```

Running in development mode can allow you to run in full node mode instead of the default neutrino mode, and will also allow you to run in simnet node for testing. The app will use it's own lnd `data/lnd` dir and does not share state with other lnd installations on your system. See [setup local cluster](https://github.com/lightninglabs/lightning-app/blob/master/assets/script/setup_local_cluster.md) on how to set up your simnet cluster for development.

#### Review UI style guide

To build the UI style guide
```
npm run storybook
```

### Building the Packaged App

To build the packaged version of the app e.g. for macOS run:
```
cp $GOPATH/bin/lnd ./assets/bin/darwin
npm run electron-pack
```

The packaged app will then be available in the `dist` directory. The packaged version of the app will run on Bitcoin mainnet.

### Starting the Packaged App (light client)

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning
```

The app is configured for mainnet by default but you can opt-in to testnet:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning --bitcoin.testnet --bitcoin.node=neutrino --neutrino.addpeer=btcd-testnet.lightning.computer --neutrino.feeurl=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json
```

### Starting the Packaged App (full node)

#### btcd
Start btcd in a separate terminal session and wait until it's fully synced (can take a while):
```
btcd --txindex --rpcuser=kek --rpcpass=kek
```

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning --bitcoin.mainnet --btcd.rpcuser=kek --btcd.rpcpass=kek
```

#### bitcoind
Start bitcoind in a separate terminal session and wait until it's fully synced (can take over a day):
```
bitcoind -txindex=1 -rpcuser=kek -rpcpassword=kek -rpcbind=localhost -zmqpubrawblock=tcp://127.0.0.1:28332 -zmqpubrawtx=tcp://127.0.0.1:28333
```

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning --bitcoin.mainnet --bitcoin.node=bitcoind --bitcoind.rpcuser=kek --bitcoind.rpcpass=kek --bitcoind.zmqpubrawblock=tcp://127.0.0.1:28332 --bitcoind.zmqpubrawtx=tcp://127.0.0.1:28333
```

### Lnd data and logs
Lnd data and logs are written to the following locations in production:

* **Linux:** `~/.config/lightning-app/lnd`
* **OSX:** `~/Library/Application Support/lightning-app/lnd`
* **Windows:** `%USERPROFILE%\AppData\Roaming\lightning-app\lnd`
