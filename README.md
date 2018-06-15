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

To start start the app:
```
npm run electron-dev
```

Running in development mode can allow you to run in full node mode instead of the default neutrino mode, and will also allow you to run in simnet node for testing. The app will use it's own lnd config/data dir and does not share state with other lnd installations on your system.

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
