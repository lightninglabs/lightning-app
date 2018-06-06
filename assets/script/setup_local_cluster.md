## Start app to init wallet

npm run electron-dev

## Start nodes via cli

btcd --txindex --simnet --rpcuser=kek --rpcpass=kek --datadir=data/btcd/data --logdir=data/btcd/logs

lnd --rpclisten=localhost:10009 --listen=localhost:10019 --restlisten=localhost:8009 --datadir=data/lnd/data --logdir=data/lnd/logs --debuglevel=info --bitcoin.simnet --bitcoin.active --bitcoin.node=btcd --btcd.rpcuser=kek --btcd.rpcpass=kek --no-macaroons --tlscertpath=data/lnd/tls.cert --tlskeypath=data/lnd/tls.key

lncli --rpcserver=localhost:10009 --tlscertpath=data/lnd/tls.cert unlock

lnd --rpclisten=localhost:10002 --listen=localhost:10012 --restlisten=localhost:8002 --datadir=data/lnd2/data --logdir=data/lnd2/logs --debuglevel=info --bitcoin.simnet --bitcoin.active --bitcoin.node=btcd --btcd.rpcuser=kek --btcd.rpcpass=kek --no-macaroons --tlscertpath=data/lnd2/tls.cert --tlskeypath=data/lnd2/tls.key --noencryptwallet

## Fund wallets addresses

lncli --rpcserver=localhost:10009 --tlscertpath=data/lnd/tls.cert newaddress np2wkh

lncli --rpcserver=localhost:10002 --tlscertpath=data/lnd2/tls.cert newaddress np2wkh

btcd --txindex --simnet --rpcuser=kek --rpcpass=kek --datadir=data/btcd/data --logdir=data/btcd/logs --miningaddr=rmPBKAoA9MiB4WuR21wied5aA9jdqpKAS6

btcctl --simnet --rpcuser=kek --rpcpass=kek generate 400

## Open channel and send payment

lncli --rpcserver=localhost:10009 --tlscertpath=data/lnd/tls.cert getinfo

lncli --rpcserver=localhost:10002 --tlscertpath=data/lnd2/tls.cert getinfo

lncli --rpcserver=localhost:10009 --tlscertpath=data/lnd/tls.cert connect PUB_KEY@localhost:10012

lncli --rpcserver=localhost:10009 --tlscertpath=data/lnd/tls.cert openchannel --node_key=PUB_KEY --local_amt=16000000

lncli --rpcserver=localhost:10002 --tlscertpath=data/lnd2/tls.cert addinvoice --amt=10000

lncli --rpcserver=localhost:10009 --tlscertpath=data/lnd/tls.cert sendpayment --pay_req=ENCODED_INVOICE
