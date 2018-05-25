#!/bin/sh

# versions
GO_TAG=1.10.2
GLIDE_TAG=0.12.3

# install go
GO_DOWNLOAD="https://storage.googleapis.com/golang/go$GO_TAG.linux-amd64.tar.gz"
curl -L $GO_DOWNLOAD | tar -xz
mv go $HOME

# set env vars
export GOROOT=$HOME/go
export GOPATH=$HOME/gocode
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

# install dep
go get -u github.com/golang/dep/cmd/dep

# install glide
GLIDE_DOWNLOAD="https://github.com/Masterminds/glide/releases/download/v$GLIDE_TAG/glide-v$GLIDE_TAG-linux-amd64.tar.gz"
curl -L $GLIDE_DOWNLOAD | tar -xz
export PATH=$PWD/linux-amd64/:$PATH

# install lnd
git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
cd $GOPATH/src/github.com/lightningnetwork/lnd
make && make install

# install btcd
git clone https://github.com/roasbeef/btcd $GOPATH/src/github.com/roasbeef/btcd
cd $GOPATH/src/github.com/roasbeef/btcd
glide install
go install . ./cmd/...

# copy lnd/btcd binaries to git repo for integration tests
cp $GOPATH/bin/* $TRAVIS_BUILD_DIR/assets/bin/linux/

# create empty btcd.conf for btcctl
mkdir $HOME/.btcd && touch $HOME/.btcd/btcd.conf
