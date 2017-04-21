import path from 'path'
import grpc from 'grpc'

const { lnrpc } = grpc.load(path.join(__dirname, 'rpc.proto'))
const connection = new lnrpc.Lightning('localhost:10009', grpc.credentials.createInsecure())
const serverReady = cb => grpc.waitForClientReady(connection, Infinity, cb)

export default {
  connection,
  serverReady,
}
