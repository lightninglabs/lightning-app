Lightning [![Build Status](https://travis-ci.org/lightninglabs/lightning-app.svg?branch=master)](https://travis-ci.org/lightninglabs/lightning-app)
==========

An easy-to-use cross platform lightning wallet

![Screenshot](https://github.com/lightninglabs/lightning-app/blob/5f2620d1e99ed1372985fec2063066236e4c16d9/assets/screenshot.png)

**N.B. The app is under development and the code has not yet been audited. It's currently configured to run on testnet.**

### Getting Started

The app comes for two threat models:

1. *Pocket Money:* prebuilt and signed [releases](https://github.com/lightninglabs/lightning-app/releases) with auto update (recommended for most users).

2. *Tin Foil Hat:* if you'd rather build it yourself and do without auto updates, see the instructions below.

After installing the app, head on over to the [testnet faucet](https://testnet.coinfaucet.eu/en/) to send some test BTC to your wallet.

### Contributing

See the `ToDo (next release)` column on our [project board](https://github.com/lightninglabs/lightning-app/projects/1?fullscreen=true). Issues that are easy to pick up for outside contributors are labeled `help wanted`.

### Developing Locally

#### Install lnd
```
git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
cd $GOPATH/src/github.com/lightningnetwork/lnd
make && make install tags=experimental
```

#### Install btcd
```
git clone https://github.com/btcsuite/btcd $GOPATH/src/github.com/btcsuite/btcd
cd $GOPATH/src/github.com/btcsuite/btcd
glide install
go install . ./cmd/...
```

Then start by cloning this git repo and go inside the project folder to run the following commands:
```
npm install

npm test
```

To build the UI style guide
```
npm run storybook
```

To start start the app in development mode (simnet):
```
npm run electron-dev
```

Running in development mode can allow you to run in full node mode instead of the default neutrino mode, and will also allow you to run in simnet node for testing. The app will use it's own lnd `data/lnd` dir and does not share state with other lnd installations on your system. See [setup local cluster](https://github.com/lightninglabs/lightning-app/blob/master/assets/script/setup_local_cluster.md) on how to set up your simnet cluster for development.

### Building the Packaged App

To build the packaged version of the app e.g. for macOS run:
```
cp $GOPATH/bin/lnd ./assets/bin/darwin
npm run electron-pack
```

The packaged app will then be available in the `dist` directory. The packaged version of the app will run on Bitcoin testnet.

### Starting the Packaged App (light client)

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning
```

### Starting the Packaged App (full node)

#### btcd
Start btcd in a seperate terminal session and wait until it's fully synced (can take over a day)
```
btcd --testnet --txindex --rpcuser=kek --rpcpass=kek
```

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning --btcd.rpcuser=kek --btcd.rpcpass=kek
```

#### bitcoind
Start bitcoind in a seperate terminal session and wait until it's fully synced (can take over a day)
```
bitcoind -testnet -txindex=1 -rpcuser=kek -rpcpassword=kek -rpcbind=localhost -zmqpubrawblock=tcp://127.0.0.1:28332 -zmqpubrawtx=tcp://127.0.0.1:28333
```

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning --bitcoin.node=bitcoind --bitcoind.rpcuser=kek --bitcoind.rpcpass=kek --bitcoind.zmqpubrawblock=tcp://127.0.0.1:28332 --bitcoind.zmqpubrawtx=tcp://127.0.0.1:28333
```

### Lnd data and logs
Lnd data and logs are written to the following locations in production:

* **Linux:** `~/.config/lightning-app/lnd`
* **OSX:** `~/Library/Application Support/lightning-app/lnd`
* **Windows:** `%USERPROFILE%\AppData\Roaming\lightning-app\lnd`
