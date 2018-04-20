import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc';
import InvoiceAction from '../../../src/action/invoice';
import NotificationAction from '../../../src/action/notification';

describe('Action Invoice Unit Tests', () => {
  let store;
  let grpc;
  let invoice;
  let notification;

  beforeEach(() => {
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    notification = sinon.createStubInstance(NotificationAction);
    invoice = new InvoiceAction(store, grpc, notification);
  });

  describe('clear()', () => {
    it('should clear invoice attributes', async () => {
      store.invoice.amount = 'foo';
      store.invoice.note = 'bar';
      await invoice.clear();
      expect(store.invoice.amount, 'to equal', '');
      expect(store.invoice.note, 'to equal', '');
    });
  });

  describe('setAmount()', () => {
    it('should clear invoice attributes', async () => {
      await invoice.setAmount({ amount: '0.01' });
      expect(store.invoice.amount, 'to equal', '0.01');
    });
  });

  describe('setNote()', () => {
    it('should clear invoice attributes', async () => {
      await invoice.setNote({ note: 'foo' });
      expect(store.invoice.note, 'to equal', 'foo');
    });
  });

  describe('generateUri()', () => {
    it('should add invoice and set uri', async () => {
      store.invoice.amount = '0.00001';
      store.invoice.note = 'foo';
      grpc.sendCommand
        .withArgs('addInvoice', {
          value: 1000,
          memo: 'foo',
        })
        .resolves({
          payment_request: 'some-request',
        });
      await invoice.generateUri();
      expect(store.invoice.encoded, 'to equal', 'some-request');
      expect(store.invoice.uri, 'to equal', 'lightning:some-request');
    });
  });
});
