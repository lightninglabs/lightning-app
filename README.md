## Lightning Desktop App

This repo houses a cross-platform Lightning desktop app powered by
[`lnd`](https://github.com/lightningnetwork/lnd/). The application is under
active development and currently only operates on the Bitcoin testnet chain.

<img src="screenshot.png">

### Developing Locally


First start by pulling down the git repo:
```
git clone https://github.com/lightninglabs/lightning-app.git
```

Then go inside the project folder and run the following commands (grab a coffee, this might take a while):
```
cd lightning-app
npm run setup
```

After everything has installed you can run the app in dev mode:
```
npm start
```

In dev mode, the app will be using simnet.

### Errors

If you get any errors related to GRPC on startup, run:
```
npm run setup
```

### Logs
Logs are written to the following locations:

* **Linux:** `~/.config/Lightning/log.log`
* **OSX:** `~/Library/Logs/Lightning/log.log`
* **Windows:** `%USERPROFILE%\AppData\Roaming\Lightning\log.log`

### Building

To build the packaged version of the app for your current platform, run:
```
npm run package-electron
```

The packaged app will then be available in the lightning-app/release directory. The packaged version of the app will run on Bitcoin testnet. To debug a packaged app, go to localhost:9997 in your browser.

### Cross-plaform packaging
To package the app for all platforms run `npm run package-all-electron`. If running on MacOS, you'll need xquartz `brew cask install xquartz` and wine `brew install wine`. If you run into `ENFILE: file table overflow` as an error put `ulimit -n 2560` in your bash profile.

Also Check: https://github.com/karma-runner/karma/issues/1979#issuecomment-217994084

