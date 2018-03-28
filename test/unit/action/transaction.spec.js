import { observable, useStrict } from 'mobx';
import GrpcAction from '../../../src/action/grpc';
import TransactionAction from '../../../src/action/transaction';
import * as logger from '../../../src/action/log';

describe('Action Transactions Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let transaction;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    transaction = new TransactionAction(store, grpc);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTransactions()', () => {
    it('should set transaction response in store', async () => {
      grpc.sendCommand.withArgs('getTransactions').resolves({
        transactions: [
          {
            tx_hash: 'some-hash',
            amount: 42,
            num_confirmations: 6,
            time_stamp: 1517585154925,
          },
        ],
      });
      await transaction.getTransactions();
      expect(store.transactions[0], 'to equal', {
        id: 'some-hash',
        type: 'bitcoin',
        amount: 42,
        status: 'confirmed',
        date: new Date('Fri, 02 Feb 2018 15:25:54.925 GMT'),
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
            creation_date: 1517585154925,
            value: 42,
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
        date: new Date('Fri, 02 Feb 2018 15:25:54.925 GMT'),
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
            creation_date: 1517585154925,
            value: 42,
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
        status: 'complete',
        date: new Date('Fri, 02 Feb 2018 15:25:54.925 GMT'),
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
