/* eslint-disable no-var */
var grpc = require('grpc')

const path = process.env.NODE_ENV === 'development' ? '../lightning-desktop/rpc.proto' : './rpc.proto'
var lnrpc = grpc.load(path).lnrpc
var lndConn = new lnrpc.Lightning('localhost:10009', grpc.credentials.createInsecure())

module.exports = {
  default: lndConn,
}
