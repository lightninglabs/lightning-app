Lightning [![Build Status](https://travis-ci.org/lightninglabs/lightning-app.svg?branch=master)](https://travis-ci.org/lightninglabs/lightning-app)
==========

An easy-to-use cross platform lightning wallet

![Screenshot](https://github.com/lightninglabs/lightning-app/blob/5f2620d1e99ed1372985fec2063066236e4c16d9/assets/screenshot.png)

**N.B. The app is under active development and the code has not yet been audited. It's currently configure to run on testnet.**

### Getting Started

The app comes for two threat models:

1. *Pocket Money:* prebuilt and signed [releases](https://github.com/lightninglabs/lightning-app/releases) with auto update (recommended for most users)

2. *Tin Foil Hat:* if you'd rather build it yourself and do without auto updates, see the instructions below ...

After installing the app, head on over to the [testnet faucet](https://testnet.coinfaucet.eu/en/) to send some test BTC to your wallet.

### Developing Locally

You'll need to build `lnd` and `btcd` locally using the [installation guide](http://dev.lightning.community/guides/installation/). Then start by cloning this git repo and go inside the project folder to run the following commands:
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

Running in development mode can allow you to run in full node mode instead of the default neutrino mode, and will also allow you to run in simnet node for testing. The app will use it's own lnd `data/lnd` dir and does not share state with other lnd installations on your system.

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

Start btcd in a seperate terminal session and wait until it's fully synced (can take over a day)
```
btcd --testnet --txindex --rpcuser=kek --rpcpass=kek
```

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning --btcd.rpcuser=kek --btcd.rpcpass=kek
```


### Lnd data and logs
Lnd data and logs are written to the following locations in production:

* **Linux:** `~/.config/lightning-app/lnd`
* **OSX:** `~/Library/Application Support/lightning-app/lnd`
* **Windows:** `%USERPROFILE%\AppData\Roaming\lightning-app\lnd`
