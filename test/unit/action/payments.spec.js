import { observable, useStrict } from 'mobx';
import GrpcAction from '../../../src/action/grpc';
import WalletAction from '../../../src/action/wallet';
import PaymentAction from '../../../src/action/payments';
import NotificationAction from '../../../src/action/notification';
import * as logger from '../../../src/action/logs';

describe('Action Payments Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let wallet;
  let payment;
  let notification;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    wallet = sinon.createStubInstance(WalletAction);
    notification = sinon.createStubInstance(NotificationAction);
    payment = new PaymentAction(store, grpc, wallet, notification);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('sendCoins()', () => {
    it('should send on-chain transaction', async () => {
      grpc.sendCommand.withArgs('sendCoins').resolves();
      await payment.sendCoins({
        address: 'some-address',
        amount: 'some-amount',
      });
      expect(notification.display, 'was not called');
      expect(wallet.getBalance, 'was called once');
    });

    it('should display notification on error', async () => {
      grpc.sendCommand.withArgs('sendCoins').rejects();
      await payment.sendCoins({
        address: 'some-address',
        amount: 'some-amount',
      });
      expect(notification.display, 'was called once');
      expect(wallet.getBalance, 'was called once');
    });
  });

  describe('payLightning()', () => {
    let paymentsOnStub;
    let paymentsWriteStub;

    beforeEach(() => {
      paymentsOnStub = sinon.stub();
      paymentsWriteStub = sinon.stub();
      grpc.sendStreamCommand.withArgs('sendPayment').returns({
        on: paymentsOnStub,
        write: paymentsWriteStub,
      });
    });

    it('should send lightning payment', async () => {
      paymentsOnStub.withArgs('data').yields({ payment_error: '' });
      await payment.payLightning({ payment: 'some-payment' });
      expect(grpc.sendStreamCommand, 'was called with', 'sendPayment');
      expect(
        paymentsWriteStub,
        'was called with',
        JSON.stringify({ payment_request: 'some-payment' }),
        'utf8'
      );
      expect(notification.display, 'was not called');
      expect(wallet.getChannelBalance, 'was called once');
    });

    it('should display notification on error', async () => {
      paymentsOnStub.withArgs('data').yields({ payment_error: 'Boom!' });
      await payment.payLightning({ payment: 'some-payment' });
      expect(notification.display, 'was called once');
      expect(wallet.getChannelBalance, 'was called once');
    });
  });

  describe('decodePaymentRequest()', () => {
    it('should decode successfully', async () => {
      grpc.sendCommand.withArgs('decodePayReq').resolves({
        num_satoshis: '1700',
        description: 'foo',
      });
      await payment.decodePaymentRequest({
        payment: 'some-payment',
      });
      expect(store.paymentRequest.numSatoshis, 'to be', '1700');
      expect(store.paymentRequest.description, 'to be', 'foo');
    });

    it('should set response to null on error', async () => {
      grpc.sendCommand.withArgs('decodePayReq').rejects(new Error('Boom!'));
      await payment.decodePaymentRequest({
        payment: 'some-payment',
      });
      expect(store.paymentRequest, 'to be', null);
      expect(logger.error, 'was called once');
    });
  });
});
