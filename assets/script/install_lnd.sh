#!/bin/sh

# create empty btcd.conf for btcctl
if [ "$(uname)" == "Darwin" ]; then
  PLATFORM="darwin"
  mkdir $HOME/Library/Application\ Support/Btcd && touch $HOME/Library/Application\ Support/Btcd/btcd.conf
else
  PLATFORM="linux"
  mkdir $HOME/.btcd && touch $HOME/.btcd/btcd.conf
fi

# install go
GO_DOWNLOAD="https://storage.googleapis.com/golang/go$GO_TAG.$PLATFORM-amd64.tar.gz"
curl -L $GO_DOWNLOAD | tar -xz
mv go $HOME

# install lnd
git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
cd $GOPATH/src/github.com/lightningnetwork/lnd
git checkout $LND_TAG
# enable mainnet neutrino in lnd
git fetch https://github.com/halseth/lnd.git mainnet-neutrino:mainnet-neutrino && git cherry-pick mainnet-neutrino
make && make install tags="experimental autopilotrpc signrpc walletrpc chainrpc invoicesrpc routerrpc"

# install btcd
git clone https://github.com/btcsuite/btcd $GOPATH/src/github.com/btcsuite/btcd
cd $GOPATH/src/github.com/btcsuite/btcd
git checkout $BTCD_TAG
GO111MODULE=on go install -v . ./cmd/...

# copy lnd/btcd binaries to git repo for integration tests
cp $GOPATH/bin/* $TRAVIS_BUILD_DIR/assets/bin/$PLATFORM/
