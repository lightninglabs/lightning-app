[![Build Status](https://travis-ci.org/lightninglabs/lightning-app.svg?branch=master)](https://travis-ci.org/lightninglabs/lightning-app) [![Greenkeeper badge](https://badges.greenkeeper.io/lightninglabs/lightning-app.svg)](https://greenkeeper.io/)

**N.B. The app is under development and the code has not yet been audited.**

### Developing Locally

You'll need to build `lnd` and `btcd` locally using the [installation guide](http://dev.lightning.community/guides/installation/). Then start by pulling down the git repo:
```
git clone https://github.com/lightninglabs/lightning-app.git
```

Then go inside the project folder and run the following commands:
```
cd lightning-app

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

Running in development mode can allow you to run in full node mode instead of the default neutrino mode, and will also allow you to run in simnet node for testing. The app will use it's own lnd config/data dir and does not share state with other lnd installations on your system.

### Building the Packaged App

To build the packaged version of the app e.g. for macOS run:
```
cp $GOPATH/bin/lnd ./assets/bin/darwin
npm run electron-pack
```

The packaged app will then be available in the lightning-app/dist directory. The packaged version of the app will run on Bitcoin testnet. To debug a packaged app, go to localhost:9997 in your browser.

### Starting the Packaged App (light client)

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning
```

### Starting the Packaged App (full node)

Start btcd in a seperate terminal session and wait until it's fully synced (can take over a day)
```
mkdir $HOME/Library/Application\ Support/Btcd && touch $HOME/Library/Application\ Support/Btcd/btcd.conf
btcd --testnet --txindex --rpcuser=kek --rpcpass=kek
```

To run the packaged version of the app e.g. for macOS run:
```
./dist/mac/Lightning.app/Contents/MacOS/Lightning --rpcuser=kek --rpcpass=kek
```


### Logs
Logs are written to the following locations:

* **Linux:** `~/.config/Lightning/log.log`
* **OSX:** `~/Library/Logs/Lightning/log.log`
* **Windows:** `%USERPROFILE%\AppData\Roaming\Lightning\log.log`
