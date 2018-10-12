## Start nodes via cli

```
btcd --txindex --simnet --rpcuser=kek --rpcpass=kek --datadir=data/btcd/data --logdir=data/btcd/logs

lnd --rpclisten=localhost:10006 --listen=localhost:10016 --restlisten=localhost:8086 --lnddir=data/lnd --debuglevel=info --bitcoin.simnet --bitcoin.active --bitcoin.node=neutrino --neutrino.connect=127.0.0.1:18555

lncli --network=simnet --rpcserver=localhost:10006 --lnddir=data/lnd create

lnd --rpclisten=localhost:10002 --listen=localhost:10012 --restlisten=localhost:8002 --lnddir=data/lnd2 --debuglevel=info --bitcoin.simnet --bitcoin.active --bitcoin.node=neutrino --neutrino.connect=127.0.0.1:18555

lncli --network=simnet --rpcserver=localhost:10002 --lnddir=data/lnd2 create
```

## Fund wallets addresses

```
lncli --network=simnet --rpcserver=localhost:10006 --lnddir=data/lnd newaddress np2wkh

btcd --txindex --simnet --rpcuser=kek --rpcpass=kek --datadir=data/btcd/data --logdir=data/btcd/logs --miningaddr=NEW_ADDRESS

btcctl --simnet --rpcuser=kek --rpcpass=kek generate 400
```

## Open channel and send payment

```
lncli --network=simnet --rpcserver=localhost:10002 --lnddir=data/lnd2 getinfo

lncli --network=simnet --rpcserver=localhost:10006 --lnddir=data/lnd connect PUB_KEY@localhost:10012

lncli --network=simnet --rpcserver=localhost:10006 --lnddir=data/lnd openchannel --node_key=PUB_KEY --local_amt=16000000

btcctl --simnet --rpcuser=kek --rpcpass=kek generate 6

lncli --network=simnet --rpcserver=localhost:10006 --lnddir=data/lnd listchannels

lncli --network=simnet --rpcserver=localhost:10002 --lnddir=data/lnd2 addinvoice --amt=10000

lncli --network=simnet --rpcserver=localhost:10006 --lnddir=data/lnd sendpayment --pay_req=ENCODED_INVOICE
```
