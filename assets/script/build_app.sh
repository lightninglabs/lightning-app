#!/bin/sh

# set env vars
GOPATH=$HOME/gocode
GOROOT=$HOME/go
PATH=$GOPATH/bin:$GOROOT/bin:$PATH

if [ "$(uname)" == "Darwin" ]; then
  npm run electron-pack -- --mac
else
  # build binaries for windows
  cd assets/bin/win32
  env GOOS="windows" GOARCH="386" go build -v github.com/lightningnetwork/lnd
  env GOOS="windows" GOARCH="386" go build -v github.com/btcsuite/btcd

  # build the packages using electron-builder on docker
  cd $TRAVIS_BUILD_DIR
  env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_' > env.txt
  docker run --rm \
    --env-file env.txt \
    --env ELECTRON_CACHE="/root/.cache/electron" \
    --env DEBUG=electron-builder \
    --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
    -v ${PWD}:/project \
    -v ${PWD##*/}-node-modules:/project/node_modules \
    -v ~/.cache/electron:/root/.cache/electron \
    -v ~/.cache/electron-builder:/root/.cache/electron-builder \
    electronuserland/builder:wine \
    /bin/bash -c "npm i && npm run electron-pack -- --win -c.npmArgs=--target-libc=unknown && npm run electron-pack -- --linux"
  rm env.txt
fi
