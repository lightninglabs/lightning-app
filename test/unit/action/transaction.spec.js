import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import TransactionAction from '../../../src/action/transaction';
import NavAction from '../../../src/action/nav';
import NotificationAction from '../../../src/action/notification';
import * as logger from '../../../src/action/log';

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
            tx_hash: 'some-hash',
            amount: '42',
            total_fees: '10',
            num_confirmations: 0,
            time_stamp: '1527070395',
          },
        ],
      });
      await transaction.getTransactions();
      expect(store.transactions[0], 'to equal', {
        id: 'some-hash',
        type: 'bitcoin',
        amount: 42,
        fee: 10,
        confirmations: 0,
        status: 'unconfirmed',
        date: new Date('2018-05-23T10:13:15.000Z'),
      });
    });

    it('should set confirmed transaction in store', async () => {
      grpc.sendCommand.withArgs('getTransactions').resolves({
        transactions: [
          {
            tx_hash: 'some-hash',
            amount: '42',
            total_fees: '10',
            num_confirmations: 1,
            time_stamp: '1527070395',
          },
        ],
      });
      await transaction.getTransactions();
      expect(store.transactions[0], 'to equal', {
        id: 'some-hash',
        type: 'bitcoin',
        amount: 42,
        fee: 10,
        confirmations: 1,
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
            r_hash: Buffer.from('cdab', 'hex'),
            creation_date: '1527070395',
            value: '42',
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
            creation_date: '1527070395',
            value: '42',
            fee: '10',
            settled: true,
            payment_hash: 'some-hash',
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
      });
    });

    it('should log error on failure', async () => {
      grpc.sendCommand.rejects();
      await transaction.getPayments();
      expect(logger.error, 'was called once');
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
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await transaction.subscribeInvoices();
      expect(transaction.update, 'was called once');
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
