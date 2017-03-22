import path from 'path'
import grpc from 'grpc'

const { lnrpc } = grpc.load(path.join(__dirname, 'rpc.proto'))
export const lndConn = new lnrpc.Lightning('localhost:10009', grpc.credentials.createInsecure())
