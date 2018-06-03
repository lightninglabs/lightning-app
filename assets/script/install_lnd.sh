#!/bin/sh

# versions
GO_TAG=1.10.2
if [ "$(uname)" == "Darwin" ]; then
  PLATFORM="darwin"
else
  PLATFORM="linux"
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
make && make install

# install btcd
git clone https://github.com/btcsuite/btcd $GOPATH/src/github.com/btcsuite/btcd
cd $GOPATH/src/github.com/btcsuite/btcd
glide install
go install . ./cmd/...

# copy lnd/btcd binaries to git repo for integration tests
cp $GOPATH/bin/* $TRAVIS_BUILD_DIR/assets/bin/$PLATFORM/

# create empty btcd.conf for btcctl
mkdir $HOME/.btcd && touch $HOME/.btcd/btcd.conf
