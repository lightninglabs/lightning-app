#!/bin/sh

# install go
apt-get install golang-1.8-go
export GOPATH=~/go
export PATH=$PATH:$GOPATH/bin

# install glide
go get -u github.com/Masterminds/glide

# install lnd
git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
cd $GOPATH/src/github.com/lightningnetwork/lnd
glide install
go install . ./cmd/...

# install btcd
git clone https://github.com/roasbeef/btcd $GOPATH/src/github.com/roasbeef/btcd
cd $GOPATH/src/github.com/roasbeef/btcd
glide install
go install . ./cmd/...
