import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import TransactionAction from '../../../src/action/transaction';
import NavAction from '../../../src/action/nav';
import NotificationAction from '../../../src/action/notification';
import * as logger from '../../../src/action/log';
import { nap } from '../../../src/helper';

describe('Action Transactions Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let nav;
  let notification;
  let transaction;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    nav = sinon.createStubInstance(NavAction);
    notification = sinon.createStubInstance(NotificationAction);
    transaction = new TransactionAction(store, grpc, nav, notification);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('init()', () => {
    it('should refresh and navigate to list', () => {
      sandbox.stub(transaction, 'update');
      transaction.init();
      expect(transaction.update, 'was called once');
      expect(nav.goTransactions, 'was called once');
    });
  });

  describe('select()', () => {
    it('should set selectedTransaction', () => {
      sandbox.stub(transaction, 'update');
      transaction.select({ item: 'some-transaction' });
      expect(store.selectedTransaction, 'to equal', 'some-transaction');
      expect(transaction.update, 'was called once');
      expect(nav.goTransactionDetail, 'was called once');
    });

    it('should attempt to decode with paymentRequest', () => {
      sandbox.stub(transaction, 'decodeMemo');
      transaction.select({
        item: { paymentRequest: 'some-payment-request' },
      });
      expect(transaction.decodeMemo, 'was called once');
    });

    it('should not decode with empty paymentRequest', () => {
      sandbox.stub(transaction, 'decodeMemo');
      transaction.select({
        item: { paymentRequest: '' },
      });
      expect(transaction.decodeMemo, 'was not called');
    });
  });

  describe('update()', () => {
    it('should refresh transactions', async () => {
      await transaction.update();
      expect(grpc.sendCommand, 'was called thrice');
    });
  });

  describe('getTransactions()', () => {
    it('should set unconfirmed transaction in store', async () => {
      grpc.sendCommand.withArgs('getTransactions').resolves({
        transactions: [
          {
            txHash: 'some-hash',
            amount: 42,
            totalFees: 10,
            numConfirmations: 2,
            timeStamp: 1527070395,
          },
        ],
      });
      await transaction.getTransactions();
      expect(store.transactions[0], 'to equal', {
        id: 'some-hash',
        type: 'bitcoin',
        amount: 42,
        fee: 10,
        confirmations: 2,
        status: 'unconfirmed',
        date: new Date('2018-05-23T10:13:15.000Z'),
      });
    });

    it('should set confirmed transaction in store', async () => {
      grpc.sendCommand.withArgs('getTransactions').resolves({
        transactions: [
          {
            txHash: 'some-hash',
            amount: 42,
            totalFees: 10,
            numConfirmations: 3,
            timeStamp: 1527070395,
          },
        ],
      });
      await transaction.getTransactions();
      expect(store.transactions[0], 'to equal', {
        id: 'some-hash',
        type: 'bitcoin',
        amount: 42,
        fee: 10,
        confirmations: 3,
        status: 'confirmed',
        date: new Date('2018-05-23T10:13:15.000Z'),
      });
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await transaction.getTransactions();
      expect(logger.error, 'was called once');
    });
  });

  describe('getInvoices()', () => {
    it('should set transaction response in store', async () => {
      grpc.sendCommand.withArgs('listInvoices').resolves({
        invoices: [
          {
            rHash: Buffer.from('cdab', 'hex'),
            creationDate: 1527070395,
            value: 42,
            settled: true,
            memo: 'some-memo',
            r_preimage: 'some-preimage',
          },
        ],
      });
      await transaction.getInvoices();
      expect(store.invoices[0], 'to equal', {
        id: 'cdab',
        type: 'lightning',
        amount: 42,
        status: 'complete',
        date: new Date('2018-05-23T10:13:15.000Z'),
        memo: 'some-memo',
      });
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await transaction.getInvoices();
      expect(logger.error, 'was called once');
    });
  });

  describe('getPayments()', () => {
    it('should set transaction response in store', async () => {
      grpc.sendCommand.withArgs('listPayments').resolves({
        payments: [
          {
            creationDate: 1527070395,
            value: 42,
            fee: 10,
            settled: true,
            paymentHash: 'some-hash',
            paymentPreimage: 'some-preimage',
            paymentRequest: 'some-payment-request',
          },
        ],
      });
      await transaction.getPayments();
      expect(store.payments[0], 'to equal', {
        id: 'some-hash',
        type: 'lightning',
        amount: -42,
        fee: 10,
        status: 'complete',
        date: new Date('2018-05-23T10:13:15.000Z'),
        preimage: 'some-preimage',
        paymentRequest: 'some-payment-request',
      });
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await transaction.getPayments();
      expect(logger.error, 'was called once');
    });
  });

  describe('decodeMemo()', () => {
    it('should decode successfully', async () => {
      grpc.sendCommand.withArgs('decodePayReq').resolves({
        description: 'foo',
      });
      const memo = await transaction.decodeMemo({
        payReq: 'some-payment-request',
      });
      await nap(10);
      expect(memo, 'to equal', 'foo');
    });

    it('should log info on failure', async () => {
      grpc.sendCommand.rejects();
      await transaction.decodeMemo({
        payReq: 'some-payment-request',
      });
      expect(logger.info, 'was called once');
    });
  });

  describe('subscribeTransactions()', () => {
    let onStub;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(transaction, 'update');
    });

    it('should updated transactions on data event', async () => {
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeTransactions')
        .returns({ on: onStub });
      await transaction.subscribeTransactions();
      expect(transaction.update, 'was called once');
    });

    it('should reject in case of error', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      grpc.sendStreamCommand
        .withArgs('subscribeTransactions')
        .returns({ on: onStub });
      await expect(
        transaction.subscribeTransactions(),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });

  describe('subscribeInvoices()', () => {
    let onStub;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(transaction, 'update');
    });

    it('should update invoices on data event', async () => {
      onStub.withArgs('data').yields({});
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await transaction.subscribeInvoices();
      expect(transaction.update, 'was called once');
    });

    it('should notify the user on settled invoice', async () => {
      store.computedTransactions = [{ id: 'cdab' }];
      onStub.withArgs('data').yields({
        settled: true,
        rHash: Buffer.from('cdab', 'hex'),
      });
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await transaction.subscribeInvoices();
      expect(notification.display, 'was called once');
    });

    it('should not notify the user on an unsettled invoice', async () => {
      onStub.withArgs('data').yields({ settled: false });
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await transaction.subscribeInvoices();
      expect(transaction.update, 'was called once');
      expect(notification.display, 'was not called');
    });

    it('should reject in case of error', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      grpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await expect(
        transaction.subscribeInvoices(),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
