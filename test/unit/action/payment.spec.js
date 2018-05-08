import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import WalletAction from '../../../src/action/wallet';
import PaymentAction from '../../../src/action/payment';
import NotificationAction from '../../../src/action/notification';
import NavAction from '../../../src/action/nav';
import * as logger from '../../../src/action/log';

describe('Action Payments Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let wallet;
  let payment;
  let nav;
  let notification;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    wallet = sinon.createStubInstance(WalletAction);
    notification = sinon.createStubInstance(NotificationAction);
    nav = sinon.createStubInstance(NavAction);
    payment = new PaymentAction(store, grpc, wallet, nav, notification);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('clear()', () => {
    it('should clear payment attributes', () => {
      store.payment.address = 'foo';
      store.payment.amount = 'bar';
      store.payment.note = 'baz';
      payment.clear();
      expect(store.payment.address, 'to equal', '');
      expect(store.payment.amount, 'to equal', '');
      expect(store.payment.note, 'to equal', '');
    });
  });

  describe('setAddress()', () => {
    it('should clear payment attributes', () => {
      payment.setAddress({ address: 'some-address' });
      expect(store.payment.address, 'to equal', 'some-address');
    });
  });

  describe('setAmount()', () => {
    it('should clear payment attributes', () => {
      payment.setAmount({ amount: 'some-amount' });
      expect(store.payment.amount, 'to equal', 'some-amount');
    });
  });

  describe('decodeInvoice()', () => {
    it('should decode successfully', async () => {
      grpc.sendCommand.withArgs('decodePayReq').resolves({
        num_satoshis: '1700',
        description: 'foo',
      });
      const isValid = await payment.decodeInvoice({ invoice: 'some-invoice' });
      expect(isValid, 'to be', true);
      expect(store.payment.amount, 'to match', /^0[,.]0{4}1{1}7{1}$/);
      expect(store.payment.note, 'to be', 'foo');
    });

    it('should set response to null on error', async () => {
      grpc.sendCommand.withArgs('decodePayReq').rejects(new Error('Boom!'));
      const isValid = await payment.decodeInvoice({ invoice: 'some-invoice' });
      expect(isValid, 'to be', false);
      expect(store.payment.amount, 'to be', '');
      expect(store.payment.note, 'to be', '');
      expect(logger.info, 'was called once');
    });
  });

  describe('payBitcoin()', () => {
    it('should send on-chain transaction', async () => {
      store.payment.amount = '0.00001';
      store.payment.address = 'some-address';
      grpc.sendCommand.withArgs('sendCoins').resolves();
      await payment.payBitcoin();
      expect(grpc.sendCommand, 'was called with', 'sendCoins', {
        addr: 'some-address',
        amount: 1000,
      });
      expect(nav.goHome, 'was called once');
      expect(notification.display, 'was not called');
      expect(wallet.getBalance, 'was called once');
    });

    it('should display notification on error', async () => {
      grpc.sendCommand.withArgs('sendCoins').rejects();
      await payment.payBitcoin();
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
      store.payment.address = 'lightning:some-invoice';
      await payment.payLightning();
      expect(grpc.sendStreamCommand, 'was called with', 'sendPayment');
      expect(
        paymentsWriteStub,
        'was called with',
        JSON.stringify({ payment_request: 'some-invoice' }),
        'utf8'
      );
      expect(nav.goHome, 'was called once');
      expect(notification.display, 'was not called');
      expect(wallet.getChannelBalance, 'was called once');
    });

    it('should display notification on error', async () => {
      paymentsOnStub.withArgs('data').yields({ payment_error: 'Boom!' });
      await payment.payLightning({ invoice: 'some-payment' });
      expect(notification.display, 'was called once');
      expect(wallet.getChannelBalance, 'was called once');
    });
  });
});
