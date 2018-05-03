import { Store } from '../../../src/store';
import NavAction from '../../../src/action/nav';
import GrpcAction from '../../../src/action/grpc';
import InvoiceAction from '../../../src/action/invoice';
import NotificationAction from '../../../src/action/notification';

describe('Action Invoice Unit Tests', () => {
  let store;
  let nav;
  let grpc;
  let invoice;
  let notification;

  beforeEach(() => {
    store = new Store();
    require('../../../src/config').RETRY_DELAY = 1;
    nav = sinon.createStubInstance(NavAction);
    grpc = sinon.createStubInstance(GrpcAction);
    notification = sinon.createStubInstance(NotificationAction);
    invoice = new InvoiceAction(store, grpc, nav, notification);
  });

  describe('clear()', () => {
    it('should clear invoice attributes', () => {
      store.invoice.amount = 'foo';
      store.invoice.note = 'bar';
      invoice.clear();
      expect(store.invoice.amount, 'to equal', '');
      expect(store.invoice.note, 'to equal', '');
    });
  });

  describe('setAmount()', () => {
    it('should clear invoice attributes', () => {
      invoice.setAmount({ amount: '0.01' });
      expect(store.invoice.amount, 'to equal', '0.01');
    });
  });

  describe('setNote()', () => {
    it('should clear invoice attributes', () => {
      invoice.setNote({ note: 'foo' });
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
      expect(nav.goInvoiceQR, 'was called once');
    });

    it('should display notification on error', async () => {
      grpc.sendCommand.rejects(new Error('Boom!'));
      await invoice.generateUri();
      expect(nav.goInvoiceQR, 'was not called');
      expect(notification.display, 'was called once');
    });
  });
});
