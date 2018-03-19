import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsWallet from '../../../src/actions/wallet';
import ActionsPayments from '../../../src/actions/payments';
import ActionsNotification from '../../../src/actions/notification';
import * as logger from '../../../src/actions/logs';

describe('Actions Payments Unit Tests', () => {
  let store;
  let sandbox;
  let actionsGrpc;
  let actionsWallet;
  let actionsPayments;
  let actionsNotification;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsWallet = sinon.createStubInstance(ActionsWallet);
    actionsNotification = sinon.createStubInstance(ActionsNotification);
    actionsPayments = new ActionsPayments(
      store,
      actionsGrpc,
      actionsWallet,
      actionsNotification
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('sendCoins()', () => {
    it('should send on-chain transaction', async () => {
      actionsGrpc.sendCommand.withArgs('sendCoins').resolves();
      await actionsPayments.sendCoins({
        address: 'some-address',
        amount: 'some-amount',
      });
      expect(actionsNotification.display, 'was not called');
      expect(actionsWallet.getBalance, 'was called once');
    });

    it('should display notification on error', async () => {
      actionsGrpc.sendCommand.withArgs('sendCoins').rejects();
      await actionsPayments.sendCoins({
        address: 'some-address',
        amount: 'some-amount',
      });
      expect(actionsNotification.display, 'was called once');
      expect(actionsWallet.getBalance, 'was called once');
    });
  });

  describe('payLightning()', () => {
    let paymentsOnStub;
    let paymentsWriteStub;

    beforeEach(() => {
      paymentsOnStub = sinon.stub();
      paymentsWriteStub = sinon.stub();
      actionsGrpc.sendStreamCommand.withArgs('sendPayment').returns({
        on: paymentsOnStub,
        write: paymentsWriteStub,
      });
    });

    it('should send lightning payment', async () => {
      paymentsOnStub.withArgs('data').yields({ payment_error: '' });
      await actionsPayments.payLightning({ payment: 'some-payment' });
      expect(actionsGrpc.sendStreamCommand, 'was called with', 'sendPayment');
      expect(
        paymentsWriteStub,
        'was called with',
        JSON.stringify({ payment_request: 'some-payment' }),
        'utf8'
      );
      expect(actionsNotification.display, 'was not called');
      expect(actionsWallet.getChannelBalance, 'was called once');
    });

    it('should display notification on error', async () => {
      paymentsOnStub.withArgs('data').yields({ payment_error: 'Boom!' });
      await actionsPayments.payLightning({ payment: 'some-payment' });
      expect(actionsNotification.display, 'was called once');
      expect(actionsWallet.getChannelBalance, 'was called once');
    });
  });

  describe('decodePaymentRequest()', () => {
    it('should decode successfully', async () => {
      actionsGrpc.sendCommand.withArgs('decodePayReq').resolves({
        num_satoshis: '1700',
        description: 'foo',
      });
      await actionsPayments.decodePaymentRequest({
        payment: 'some-payment',
      });
      expect(store.paymentRequest.numSatoshis, 'to be', '1700');
      expect(store.paymentRequest.description, 'to be', 'foo');
    });

    it('should set response to null on error', async () => {
      actionsGrpc.sendCommand
        .withArgs('decodePayReq')
        .rejects(new Error('Boom!'));
      await actionsPayments.decodePaymentRequest({
        payment: 'some-payment',
      });
      expect(store.paymentRequest, 'to be', null);
      expect(logger.error, 'was called once');
    });
  });
});
