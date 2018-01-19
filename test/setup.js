import expect from 'unexpected'
import unexpectedSinon from 'unexpected-sinon'
import sinon from 'sinon'

expect.use(unexpectedSinon)

global.expect = expect
global.sinon = sinon
