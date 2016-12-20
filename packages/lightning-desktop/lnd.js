import grpc from './bin/grpc'

const lnrpc = grpc.load('lnd.proto').lnrpc
const lndConn = new lnrpc.Lightning('localhost:10009', grpc.credentials.createInsecure())
export default lndConn
