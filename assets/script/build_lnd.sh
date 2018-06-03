#!/bin/sh

# set env vars
GOPATH=$HOME/gocode
GOROOT=$HOME/go
PATH=$GOPATH/bin:$GOROOT/bin:$PATH

# copy over lnd and btcd binaries for linux
cp $GOPATH/bin/lnd $GOPATH/bin/btcd ./assets/bin/linux

# build binaries for darwin/windows
cd ./assets/bin/darwin
env GOOS="darwin" GOARCH="amd64" go build -v github.com/lightningnetwork/lnd
env GOOS="darwin" GOARCH="amd64" go build -v github.com/btcsuite/btcd
cd ../win32
env GOOS="windows" GOARCH="386" go build -v github.com/lightningnetwork/lnd
env GOOS="windows" GOARCH="386" go build -v github.com/btcsuite/btcd

# build the packages using electron-builder on docker
cd $TRAVIS_BUILD_DIR
env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_' > env.txt
docker run --rm --env-file env.txt --env ELECTRON_CACHE="/root/.cache/electron" --env DEBUG=electron-builder --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" -v ${PWD}:/project -v ${PWD##*/}-node-modules:/project/node_modules -v ~/.cache/electron:/root/.cache/electron -v ~/.cache/electron-builder:/root/.cache/electron-builder electronuserland/builder:wine /bin/bash -c "npm i; npm run build; react-scripts build; ./node_modules/.bin/electron-builder --em.main=build/electron.js --linux tar.gz --win zip --mac zip"
rm env.txt

# create the file with the package hashes
PACKAGE_VERSION=$(node -pe "require('./package.json').version")
cd dist
shasum -a 256 Lightning* | sudo tee manifest-v${PACKAGE_VERSION}.txt
sudo chown -R travis:travis ./
cd ..
