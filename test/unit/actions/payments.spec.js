import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsWallet from '../../../src/actions/wallet';
import ActionsPayments from '../../../src/actions/payments';
import * as logger from '../../../src/actions/logs';

describe('Actions Payments Unit Tests', () => {
  let store;
  let sandbox;
  let actionsGrpc;
  let actionsWallet;
  let actionsPayments;
  const response = {
    destination:
      '035b55e3e08538afeef6ff9804e3830293eec1c4a6a9570f1e96a478dad1c86fed',
    payment_hash:
      'f99a06c85c12fe00bdd39cc852bf0c606bec23560d81dddbe887dd12f3783c95',
    num_satoshis: '1700',
    timestamp: '1516991998',
    expiry: '3600',
    description: '1 Espresso Coin Panna',
    description_hash: '',
    fallback_addr: '',
    cltv_expiry: '9',
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store = observable({
      lndReady: false,
      paymentInfo: {
        payment: '',
        amount: '',
      },
    });
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsWallet = sinon.createStubInstance(ActionsWallet);
    actionsPayments = new ActionsPayments(store, actionsGrpc, actionsWallet);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('makePayment()', () => {
    it('should send payment', async () => {
      actionsGrpc.sendCommand.withArgs('decodePayReq').resolves({});
      const paymentsOnStub = sinon
        .stub()
        .withArgs('data')
        .yields({ payment_error: '' });
      const paymentsWriteStub = sinon.stub();
      actionsGrpc.sendStreamCommand.withArgs('sendPayment').resolves({
        on: paymentsOnStub,
        write: paymentsWriteStub,
      });
      await actionsPayments.makePayment({
        payment: 'some-payment',
        amount: 'some-amount',
      });
      expect(actionsGrpc.sendCommand, 'was called once');
      expect(actionsGrpc.sendCommand, 'was called with', 'decodePayReq');
      expect(actionsGrpc.sendStreamCommand, 'was called with', 'sendPayment');
      expect(paymentsWriteStub, 'was called with', {
        payment_request: 'some-payment',
      });
      expect(actionsWallet.updateBalances, 'was not called');
    });

    it('should throw error if send payment fails', async () => {
      actionsGrpc.sendCommand.withArgs('decodePayReq').resolves({});
      const paymentsOnStub = sinon
        .stub()
        .withArgs('data')
        .yields({ payment_error: 'Boom!' });
      const paymentsWriteStub = sinon.stub();
      actionsGrpc.sendStreamCommand.withArgs('sendPayment').resolves({
        on: paymentsOnStub,
        write: paymentsWriteStub,
      });
      await expect(
        actionsPayments.makePayment({
          payment: 'some-payment',
          amount: 'some-amount',
        }),
        'to be rejected with error satisfying',
        /Payment route failure/
      );
    });

    it('should send to coin address if decoding payment request failed', async () => {
      actionsGrpc.sendCommand
        .withArgs('decodePayReq')
        .rejects(new Error('Boom!'));
      actionsGrpc.sendCommand.withArgs('sendCoins').resolves();
      await actionsPayments.makePayment({
        payment: 'some-payment',
        amount: 'some-amount',
      });
      expect(actionsGrpc.sendCommand, 'was called with', 'decodePayReq');
      expect(actionsGrpc.sendStreamCommand, 'was not called');
      expect(actionsGrpc.sendCommand, 'was called with', 'sendCoins', {
        addr: 'some-payment',
        amount: 'some-amount',
      });
      expect(actionsWallet.updateBalances, 'was called once');
    });
  });

  describe('decodePaymentRequest()', () => {
    it('should decode successfully', async () => {
      actionsGrpc.sendCommand.withArgs('decodePayReq').resolves(response);
      await actionsPayments.decodePaymentRequest('goodPaymentRequest');
      expect(
        store.paymentRequestResponse.numSatoshis,
        'to be',
        response.num_satoshis
      );
      expect(
        store.paymentRequestResponse.description,
        'to be',
        response.description
      );
    });

    it('should reset state in case of failure', async () => {
      actionsGrpc.sendCommand
        .withArgs('decodePayReq')
        .rejects(new Error('Boom!'));
      await expect(
        actionsPayments.decodePaymentRequest('goodPaymentRequest'),
        'to be rejected with error satisfying',
        /Boom/
      );
      expect(store.paymentRequestResponse.numSatoshis, 'to be', undefined);
      expect(store.paymentRequestResponse.description, 'to be', undefined);
    });
  });

  describe('setPaymentInfo()', () => {
    it('should set paymentInfo property', () => {
      actionsPayments.setPaymentInfo('amount', 123);
      actionsPayments.setPaymentInfo(
        'payment',
        '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX'
      );
      expect(store.paymentInfo.amount, 'to be', 123);
      expect(
        store.paymentInfo.payment,
        'to be',
        '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX'
      );
    });

    it('should clear paymentInfo and paymentRequestResponse', async () => {
      // Set paymentRequestResponse
      actionsGrpc.sendCommand.withArgs('decodePayReq').resolves(response);
      await actionsPayments.decodePaymentRequest('goodPaymentRequest');
      // Set paymentInfo
      actionsPayments.setPaymentInfo('amount', 123);
      actionsPayments.setPaymentInfo(
        'payment',
        '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX'
      );
      // Clear
      actionsPayments.clearPaymentInfo();

      expect(store.paymentInfo.amount, 'to be', '');
      expect(store.paymentInfo.payment, 'to be', '');
      expect(store.paymentRequestResponse.numSatoshis, 'to be', undefined);
      expect(store.paymentRequestResponse.description, 'to be', undefined);
    });
  });
});
