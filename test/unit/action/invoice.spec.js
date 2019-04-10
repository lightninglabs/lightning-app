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
  let clipboard;

  beforeEach(() => {
    store = new Store();
    store.settings.unit = 'btc';
    store.settings.displayFiat = false;
    require('../../../src/config').RETRY_DELAY = 1;
    nav = sinon.createStubInstance(NavAction);
    grpc = sinon.createStubInstance(GrpcAction);
    notification = sinon.createStubInstance(NotificationAction);
    clipboard = { setString: sinon.stub() };
    invoice = new InvoiceAction(store, grpc, nav, notification, clipboard);
  });

  describe('init()', () => {
    it('should clear attributes and navigate to invoice view', () => {
      store.invoice.amount = 'foo';
      store.invoice.note = 'bar';
      store.invoice.encoded = 'baz';
      store.invoice.uri = 'blub';
      invoice.init();
      expect(store.invoice.amount, 'to equal', '');
      expect(store.invoice.note, 'to equal', '');
      expect(store.invoice.encoded, 'to equal', '');
      expect(store.invoice.uri, 'to equal', '');
      expect(nav.goInvoice, 'was called once');
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
          expiry: 172800,
          private: true,
        })
        .resolves({
          paymentRequest: 'some-request',
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
      expect(notification.display, 'was called twice');
    });
  });

  describe('toClipboard()', () => {
    it('should call react native ClipBoard.setString', () => {
      invoice.toClipboard({ text: 'foo' });
      expect(clipboard.setString, 'was called with', 'foo');
    });
  });

  describe('checkAmount()', () => {
    beforeEach(() => {
      store.channels = [
        {
          chanId: 42,
          active: true,
          capacity: 100,
          localBalance: 10,
          remoteBalance: 90,
          channelPoint: 'FFFF:1',
        },
      ];
    });

    it('should show a notification if the amount is too big to receive', () => {
      invoice.checkAmount({ satAmount: 91 });
      expect(notification.display, 'was called once');
    });

    it('should not show a notification if the amount is below the max', () => {
      invoice.checkAmount({ satAmount: 90 });
      expect(notification.display, 'was not called');
    });
  });
});
