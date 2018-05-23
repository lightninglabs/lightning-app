import { observable, useStrict } from 'mobx';
import GrpcAction from '../../../src/action/grpc';
import TransactionAction from '../../../src/action/transaction';
import NavAction from '../../../src/action/nav';
import * as logger from '../../../src/action/log';

describe('Action Transactions Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let nav;
  let transaction;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    nav = sinon.createStubInstance(NavAction);
    transaction = new TransactionAction(store, grpc, nav);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('select()', () => {
    it('should set selectedTransaction', () => {
      const item = 'some-transaction';
      transaction.select({ item });
      expect(store.selectedTransaction, 'to equal', 'some-transaction');
      expect(nav.goTransactionDetail, 'was called once');
    });
  });

  describe('getTransactions()', () => {
    it('should set transaction response in store', async () => {
      grpc.sendCommand.withArgs('getTransactions').resolves({
        transactions: [
          {
            tx_hash: 'some-hash',
            amount: '42',
            total_fees: '10',
            num_confirmations: '6',
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
        confirmations: 6,
        status: 'confirmed',
        date: new Date('2018-05-23T10:13:15.000Z'),
        hash: 'some-hash',
      });
    });

    it('should retry on failure', async () => {
      grpc.sendCommand.onFirstCall().rejects();
      await transaction.getTransactions();
      grpc.sendCommand.resolves({});
      await nap(30);
      expect(grpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getInvoices()', () => {
    it('should set transaction response in store', async () => {
      grpc.sendCommand.withArgs('listInvoices').resolves({
        invoices: [
          {
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
        id: 1517585154925,
        type: 'lightning',
        amount: 42,
        status: 'complete',
        date: new Date('2018-05-23T10:13:15.000Z'),
        memo: 'some-memo',
        hash: 'b2899efa9ade8a66a0',
      });
    });

    it('should retry on failure', async () => {
      grpc.sendCommand.onFirstCall().rejects();
      await transaction.getInvoices();
      grpc.sendCommand.resolves({});
      await nap(30);
      expect(grpc.sendCommand.callCount, 'to be greater than', 1);
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
        id: 1517585154925,
        type: 'lightning',
        amount: 42,
        fee: 10,
        status: 'complete',
        date: new Date('2018-05-23T10:13:15.000Z'),
        hash: 'some-hash',
      });
    });

    it('should retry on failure', async () => {
      grpc.sendCommand.onFirstCall().rejects();
      await transaction.getPayments();
      grpc.sendCommand.resolves({});
      await nap(30);
      expect(grpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('subscribeTransactions()', () => {
    let onStub;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(transaction, 'getTransactions');
    });

    it('should updated transactions on data event', async () => {
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeTransactions')
        .returns({ on: onStub });
      await transaction.subscribeTransactions();
      expect(transaction.getTransactions, 'was called once');
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
      sandbox.stub(transaction, 'getInvoices');
    });

    it('should update invoices on data event', async () => {
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await transaction.subscribeInvoices();
      expect(transaction.getInvoices, 'was called once');
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
