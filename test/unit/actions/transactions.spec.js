import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsTransactions from '../../../src/actions/transactions';
import * as logger from '../../../src/actions/logs';

describe('Actions Transactions Unit Tests', () => {
  let store;
  let sandbox;
  let actionsGrpc;
  let actionsTransactions;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(logger);
    useStrict(false);
    store = observable({ lndReady: false });
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsTransactions = new ActionsTransactions(store, actionsGrpc);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTransactions()', () => {
    it('should set transaction response in store', async () => {
      actionsGrpc.sendCommand.withArgs('getTransactions').resolves({
        transactions: [
          {
            tx_hash: 'some-hash',
            amount: 42,
            num_confirmations: 6,
            time_stamp: 1517585154925,
          },
        ],
      });
      await actionsTransactions.getTransactions();
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
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsTransactions.getTransactions();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getInvoices()', () => {
    it('should set transaction response in store', async () => {
      actionsGrpc.sendCommand.withArgs('listInvoices').resolves({
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
      await actionsTransactions.getInvoices();
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
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsTransactions.getInvoices();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getPayments()', () => {
    it('should set transaction response in store', async () => {
      actionsGrpc.sendCommand.withArgs('listPayments').resolves({
        payments: [
          {
            creation_date: 1517585154925,
            value: 42,
            settled: true,
            payment_hash: 'some-hash',
          },
        ],
      });
      await actionsTransactions.getPayments();
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
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsTransactions.getPayments();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('subscribeTransactions()', () => {
    let onStub;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(actionsTransactions, 'getTransactions');
    });

    it('should updated transactions on data event', async () => {
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand
        .withArgs('subscribeTransactions')
        .returns({ on: onStub });
      await actionsTransactions.subscribeTransactions();
      expect(actionsTransactions.getTransactions, 'was called once');
    });

    it('should reject in case of error', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      actionsGrpc.sendStreamCommand
        .withArgs('subscribeTransactions')
        .returns({ on: onStub });
      await expect(
        actionsTransactions.subscribeTransactions(),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });

  describe('subscribeInvoices()', () => {
    let onStub;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(actionsTransactions, 'getInvoices');
    });

    it('should update invoices on data event', async () => {
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      actionsGrpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await actionsTransactions.subscribeInvoices();
      expect(actionsTransactions.getInvoices, 'was called once');
    });

    it('should reject in case of error', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      actionsGrpc.sendStreamCommand
        .withArgs('subscribeInvoices')
        .returns({ on: onStub });
      await expect(
        actionsTransactions.subscribeInvoices(),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });
});
