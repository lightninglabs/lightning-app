#!/bin/sh

# versions
GO_TAG=1.11.1
LND_TAG=721e9a2a90eb6a3eb985b02af6c56762026aa16f
BTCD_TAG=2a560b2036bee5e3679ec2133eb6520b2f195213

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

# set env vars
export GOROOT=$HOME/go
export GOPATH=$HOME/gocode
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

# install dep
go get -u github.com/golang/dep/cmd/dep

# install glide
go get -u github.com/Masterminds/glide

# install lnd
git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
cd $GOPATH/src/github.com/lightningnetwork/lnd
git checkout $LND_TAG
make && make install tags=experimental

# install btcd
git clone https://github.com/btcsuite/btcd $GOPATH/src/github.com/btcsuite/btcd
cd $GOPATH/src/github.com/btcsuite/btcd
git checkout $BTCD_TAG
glide install
go install . ./cmd/...

# copy lnd/btcd binaries to git repo for integration tests
cp $GOPATH/bin/* $TRAVIS_BUILD_DIR/assets/bin/$PLATFORM/
