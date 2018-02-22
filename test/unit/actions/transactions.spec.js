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

  describe('constructor()', () => {
    it('should get transactions, invoices, payments on lndReady', () => {
      actionsGrpc.sendCommand.resolves({});
      expect(actionsGrpc.sendCommand, 'was not called');
      store.lndReady = true;
      expect(actionsGrpc.sendCommand, 'was called with', 'getTransactions');
      expect(actionsGrpc.sendCommand, 'was called with', 'listInvoices');
      expect(actionsGrpc.sendCommand, 'was called with', 'listPayments');
    });
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
      expect(store.transactionsResponse[0], 'to equal', {
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
      expect(store.invoicesResponse[0], 'to equal', {
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
      expect(store.paymentsResponse[0], 'to equal', {
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
    it('should set transaction response in store', async () => {
      actionsGrpc.sendStreamCommand
        .withArgs('subscribeTransactions')
        .resolves();
      await actionsTransactions.subscribeTransactions();
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendStreamCommand.onFirstCall().rejects();
      await actionsTransactions.subscribeTransactions();
      actionsGrpc.sendStreamCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendStreamCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('subscribeInvoices()', () => {
    it('should set transaction response in store', async () => {
      actionsGrpc.sendStreamCommand.withArgs('subscribeInvoices').resolves();
      await actionsTransactions.subscribeInvoices();
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendStreamCommand.onFirstCall().rejects();
      await actionsTransactions.subscribeInvoices();
      actionsGrpc.sendStreamCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendStreamCommand.callCount, 'to be greater than', 1);
    });
  });
});
