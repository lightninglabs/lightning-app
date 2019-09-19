#!/bin/sh

# exit on immediately on non-zero status
set -e

# activate auto update in app config
echo "module.exports.AUTO_UPDATE_ENABLED = true;" >> ./src/config.js

if [ "$(uname)" == "Darwin" ]; then
  # build electron app for macOS
  npm run electron-pack -- --mac
else
  # build binaries for windows
  cd $GOPATH/src/github.com/lightningnetwork/lnd
  GOOS="windows" GOARCH="386" GO111MODULE="on" go build -tags="experimental autopilotrpc signrpc walletrpc chainrpc invoicesrpc routerrpc" -v github.com/lightningnetwork/lnd/cmd/lnd
  cp lnd.exe $TRAVIS_BUILD_DIR/assets/bin/win32/

  # build the packages using electron-builder on docker
  cd $TRAVIS_BUILD_DIR
  env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_' > env.txt
  docker run --rm \
    --env-file env.txt \
    --env HOME="/project" \
    --env ELECTRON_CACHE="/root/.cache/electron" \
    --env DEBUG=electron-builder \
    --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
    -v ${PWD}:/project \
    -v ${PWD##*/}-node-modules:/project/node_modules \
    -v ~/.cache/electron:/root/.cache/electron \
    -v ~/.cache/electron-builder:/root/.cache/electron-builder \
    electronuserland/builder:wine \
    /bin/bash -c "chown -R root:root /project && npm i && npm run electron-pack -- --win -c.npmArgs=--target-libc=unknown && npm run electron-pack -- --linux"
  sudo chown -R travis:travis ./
  rm env.txt
fi
