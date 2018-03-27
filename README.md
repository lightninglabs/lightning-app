[![Build Status](https://travis-ci.org/lightninglabs/lightning-app.svg?branch=master)](https://travis-ci.org/lightninglabs/lightning-app) [![Greenkeeper badge](https://badges.greenkeeper.io/lightninglabs/lightning-app.svg)](https://greenkeeper.io/)

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

To start start the app:
```
npm run electron-dev
```

In development mode, the app will look for an lnd.conf in the default location for your platform. See [`lnd.conf` details](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md#creating-an-lndconf-optional). A typical lnd.conf for running on simnet will look like the following:

```
debuglevel=debug
bitcoin.active=1
bitcoin.simnet=1
bitcoin.rpcuser=lnd
bitcoin.rpcpass=lnd
```

Running in development mode can allow you to run in full node mode instead of the default neutrino mode, and will also allow you to run in simnet node for testing.

Note that in order to run in simnet node, you will have also had to separately install and configure the [roasbeef fork of `btcd`](https://github.com/roasbeef/btcd). Additional instructions for running simnet can be found [here](https://gist.github.com/davecgh/2992ed85d41307e794f6).

Also note that if you have installed and built [`lnd`](https://github.com/lightningnetwork/lnd) separately, if an instance is running when the app starts, the app will connect to the already running instance rather than attempt to start a new one.

If you want your lnd.conf to replicate the configuration used by the packaged app, you can use the following:

```
debuglevel=info
bitcoin.active=1
bitcoin.testnet=1
neutrino.active=1
neutrino.connect=btcd0.lightning.computer:18333
autopilot.active=1
```


### Building the Packaged App

To build the packaged version of the app for your current platform, run:
```
npm run electron-pack
```

The packaged app will then be available in the lightning-app/dist directory. The packaged version of the app will run on Bitcoin testnet. To debug a packaged app, go to localhost:9997 in your browser.


### Logs
Logs are written to the following locations:

* **Linux:** `~/.config/Lightning/log.log`
* **OSX:** `~/Library/Logs/Lightning/log.log`
* **Windows:** `%USERPROFILE%\AppData\Roaming\Lightning\log.log`
