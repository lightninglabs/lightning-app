import { EventEmitter } from 'events';
import { Store } from '../../../src/store';
import IpcAction from '../../../src/action/ipc';
import GrpcAction from '../../../src/action/grpc';
import PaymentAction from '../../../src/action/payment';
import NotificationAction from '../../../src/action/notification';
import NavAction from '../../../src/action/nav';
import * as logger from '../../../src/action/log';
import { nap } from '../../../src/helper';

describe('Action Payments Unit Tests', () => {
  let store;
  let sandbox;
  let grpc;
  let payment;
  let nav;
  let notification;
  let clipboard;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    store.settings.unit = 'btc';
    store.settings.displayFiat = false;
    require('../../../src/config').RETRY_DELAY = 1;
    require('../../../src/config').PAYMENT_TIMEOUT = 1;
    require('../../../src/config').POLL_STORE_TIMEOUT = 1;
    grpc = sinon.createStubInstance(GrpcAction);
    notification = sinon.createStubInstance(NotificationAction);
    nav = sinon.createStubInstance(NavAction);
    clipboard = { getString: sinon.stub() };
    payment = new PaymentAction(store, grpc, nav, notification, clipboard);
  });

  afterEach(() => {
    clearTimeout(payment.tOpenUri);
    sandbox.restore();
  });

  describe('listenForUrl()', () => {
    let ipc;
    let ipcRendererStub;

    beforeEach(() => {
      ipcRendererStub = new EventEmitter();
      ipc = new IpcAction(ipcRendererStub);
      payment.listenForUrl(ipc);
      sandbox.stub(payment, 'init');
      sandbox.stub(payment, 'checkType');
    });

    it('should not navigate to payment view for invalid uri', () => {
      const uri = 'invalid-uri';
      ipcRendererStub.emit('open-url', 'some-event', uri);
      expect(payment.init, 'was not called');
    });

    it('should navigate to payment view for valid uri and lndReady', () => {
      store.lndReady = true;
      const uri = 'lightning:lntb100n1pdn2e0app';
      ipcRendererStub.emit('open-url', 'some-event', uri);
      expect(payment.init, 'was called once');
      expect(store.payment.address, 'to equal', 'lntb100n1pdn2e0app');
      expect(payment.checkType, 'was called once');
    });

    it('should wait for lndReady', async () => {
      store.lndReady = false;
      const uri = 'lightning:lntb100n1pdn2e0app';
      ipcRendererStub.emit('open-url', 'some-event', uri);
      expect(payment.init, 'was not called');
      store.lndReady = true;
      await nap(10);
      expect(payment.init, 'was called once');
      expect(store.payment.address, 'to equal', 'lntb100n1pdn2e0app');
      expect(payment.checkType, 'was called once');
    });
  });

  describe('listenForUrlMobile()', () => {
    let LinkingStub;

    beforeEach(() => {
      LinkingStub = new EventEmitter();
      LinkingStub.addEventListener = (event, callback) =>
        LinkingStub.on(event, callback);
      LinkingStub.getInitialURL = sinon.stub();
      sandbox.stub(payment, 'init');
      sandbox.stub(payment, 'checkType');
    });

    it('should not navigate to payment view for invalid url', () => {
      payment.listenForUrlMobile(LinkingStub);
      const url = 'invalid-url';
      LinkingStub.emit('url', { url });
      expect(payment.init, 'was not called');
    });

    it('should navigate to payment view for valid url and lndReady', () => {
      payment.listenForUrlMobile(LinkingStub);
      store.lndReady = true;
      const url = 'lightning:lntb100n1pdn2e0app';
      LinkingStub.emit('url', { url });
      expect(payment.init, 'was called once');
      expect(store.payment.address, 'to equal', 'lntb100n1pdn2e0app');
      expect(payment.checkType, 'was called once');
    });

    it('should navigate on start (initialUrl)', async () => {
      store.lndReady = false;
      store.navReady = false;
      store.syncedToChain = false;
      const url = 'lightning:lntb100n1pdn2e0app';
      LinkingStub.getInitialURL.resolves(url);
      payment.listenForUrlMobile(LinkingStub);
      store.navReady = true;
      await nap(10);
      expect(payment.init, 'was not called');
      store.syncedToChain = true;
      await nap(10);
      expect(payment.init, 'was not called');
      store.lndReady = true;
      await nap(10);
      expect(payment.init, 'was called once');
      expect(store.payment.address, 'to equal', 'lntb100n1pdn2e0app');
      expect(payment.checkType, 'was called once');
    });
  });

  describe('readQRCode()', () => {
    it('should read the QR data and set an address', () => {
      sandbox.stub(payment, 'checkType');
      payment.readQRCode({ data: 'lightning:lntb100n1pdn2e0app' });
      expect(store.payment.address, 'to equal', 'lntb100n1pdn2e0app');
      expect(payment.checkType, 'was called once');
    });
  });

  describe('toggleScanner()', () => {
    it('change toggle useScanner attribute', () => {
      expect(store.payment.useScanner, 'to equal', false);
      payment.toggleScanner();
      expect(store.payment.useScanner, 'to equal', true);
    });
  });

  describe('pasteAddress()', () => {
    it('should paste content of clipboard in address attribute', async () => {
      sandbox.stub(payment, 'checkType');
      clipboard.getString.resolves('lightning:lntb100n1pdn2e0app');
      await payment.pasteAddress();
      expect(store.payment.address, 'to equal', 'lntb100n1pdn2e0app');
      expect(payment.checkType, 'was called once');
    });
  });

  describe('init()', () => {
    it('should clear attributes and navigate to payment view', () => {
      store.payment.address = 'foo';
      store.payment.amount = 'bar';
      store.payment.note = 'baz';
      store.payment.fee = 'blub';
      store.payment.targetConf = 1;
      store.payment.useScanner = true;
      store.payment.sendAll = true;
      payment.init();
      expect(store.payment.address, 'to equal', '');
      expect(store.payment.amount, 'to equal', '');
      expect(store.payment.note, 'to equal', '');
      expect(store.payment.fee, 'to equal', '');
      expect(store.payment.useScanner, 'to equal', false);
      expect(store.payment.targetConf, 'to equal', 16);
      expect(store.payment.sendAll, 'to equal', false);
      expect(nav.goPay, 'was called once');
    });
  });

  describe('estimateFee()', () => {
    beforeEach(() => {
      store.payment.address = 'foo';
      store.payment.amount = '2000';
      grpc.sendCommand.withArgs('estimateFee').resolves({
        feeSat: 10000,
      });
    });

    it('should get three fee estimates', async () => {
      await payment.estimateFee();
      expect(grpc.sendCommand, 'was called thrice');
      expect(store.payment.feeEstimates[0].prio, 'to equal', 'Low');
      expect(store.payment.feeEstimates[1].prio, 'to equal', 'Med');
      expect(store.payment.feeEstimates[2].prio, 'to equal', 'High');
    });
  });

  describe('setTargetConf()', () => {
    it('should set target conf and fee', async () => {
      store.payment.feeEstimates = [{ targetConf: 6, fee: '42' }];
      await payment.setTargetConf({ targetConf: 6 });
      expect(store.payment.targetConf, 'to equal', 6);
      expect(store.payment.fee, 'to equal', '42');
    });

    it('should set target conf but not fee if not estimates', async () => {
      await payment.setTargetConf({ targetConf: 6 });
      expect(store.payment.targetConf, 'to equal', 6);
      expect(store.payment.fee, 'to equal', '');
    });
  });

  describe('initPayBitcoinConfirm()', () => {
    beforeEach(() => {
      store.payment.address = 'foo';
      store.payment.amount = '2000';
      grpc.sendCommand.withArgs('estimateFee').resolves({
        feeSat: 10000,
      });
    });

    it('should get estimate and navigate to confirm view', async () => {
      await payment.initPayBitcoinConfirm();
      expect(grpc.sendCommand, 'was called thrice');
      expect(nav.goPayBitcoinConfirm, 'was called once');
      expect(notification.display, 'was not called');
      expect(store.payment.fee, 'to be', '0.0001');
    });

    it('should not get estimate and navigate if fee and sendAll are set', async () => {
      store.payment.fee = '0.0002';
      store.payment.sendAll = true;
      await payment.initPayBitcoinConfirm();
      expect(grpc.sendCommand, 'was not called');
      expect(nav.goPayBitcoinConfirm, 'was called once');
      expect(notification.display, 'was not called');
      expect(store.payment.fee, 'to be', '0.0002');
    });

    it('should get estimate and navigate if fee is set', async () => {
      store.payment.fee = '0.0002';
      await payment.initPayBitcoinConfirm();
      expect(grpc.sendCommand, 'was called thrice');
      expect(nav.goPayBitcoinConfirm, 'was called once');
      expect(notification.display, 'was not called');
      expect(store.payment.fee, 'to be', '0.0001');
    });

    it('should get estimate and navigate if sendAll is set', async () => {
      store.payment.sendAll = true;
      await payment.initPayBitcoinConfirm();
      expect(grpc.sendCommand, 'was called thrice');
      expect(nav.goPayBitcoinConfirm, 'was called once');
      expect(notification.display, 'was not called');
      expect(store.payment.fee, 'to be', '0.0001');
    });

    it('should display notification on error', async () => {
      grpc.sendCommand.withArgs('estimateFee').rejects();
      await payment.initPayBitcoinConfirm();
      expect(grpc.sendCommand, 'was called once');
      expect(nav.goPayBitcoinConfirm, 'was not called');
      expect(notification.display, 'was called once');
      expect(store.payment.fee, 'to be', '');
    });
  });

  describe('setAddress()', () => {
    it('should set attribute', () => {
      payment.setAddress({ address: 'some-address' });
      expect(store.payment.address, 'to equal', 'some-address');
    });

    it('should work for lighning uri', () => {
      payment.setAddress({ address: 'lightning:some-address' });
      expect(store.payment.address, 'to equal', 'some-address');
    });
  });

  describe('setAmount()', () => {
    it('should set attribute', () => {
      payment.setAmount({ amount: 'some-amount' });
      expect(store.payment.amount, 'to equal', 'some-amount');
    });

    it('should reset sendAll if set', () => {
      store.payment.sendAll = true;
      payment.setAmount({ amount: 'some-amount' });
      expect(store.payment.amount, 'to equal', 'some-amount');
      expect(store.payment.sendAll, 'to be false');
    });
  });

  describe('checkType()', () => {
    beforeEach(() => {
      sandbox.stub(payment, 'decodeInvoice');
    });

    it('should notify if address is empty', async () => {
      payment.decodeInvoice.resolves(true);
      await payment.checkType();
      expect(notification.display, 'was called once');
      expect(payment.decodeInvoice, 'was not called');
    });

    it('should decode successfully', async () => {
      store.payment.address = 'some-address';
      payment.decodeInvoice.resolves(true);
      await payment.checkType();
      expect(nav.goPayLightningConfirm, 'was called once');
    });

    it('should notify if not bitcoin address', async () => {
      store.payment.address = 'some-address';
      payment.decodeInvoice.resolves(false);
      await payment.checkType();
      expect(nav.goPayBitcoin, 'was not called');
      expect(notification.display, 'was called once');
    });

    it('should navigate to bitcoin for valid address', async () => {
      store.payment.address = 'rfu4i1Mo2NF7TQsN9bMVLFSojSzcyQCEH5';
      payment.decodeInvoice.resolves(false);
      await payment.checkType();
      expect(nav.goPayBitcoin, 'was called once');
    });
  });

  describe('decodeInvoice()', () => {
    it('should decode successfully', async () => {
      grpc.sendCommand.withArgs('decodePayReq').resolves({
        numSatoshis: 1700,
        description: 'foo',
        destination: 'bar',
      });
      grpc.sendCommand
        .withArgs('queryRoutes', {
          pubKey: 'bar',
          amt: 1700,
          numRoutes: 1,
        })
        .resolves({
          routes: [{ totalFees: 100 }],
        });
      const isValid = await payment.decodeInvoice({ invoice: 'some-invoice' });
      await nap(10);
      expect(isValid, 'to be', true);
      expect(store.payment.amount, 'to match', /^0[,.]0{4}1{1}7{1}$/);
      expect(store.payment.note, 'to be', 'foo');
      expect(store.payment.fee, 'to match', /^0[,.]0{5}1{1}$/);
    });

    it('should set nothing on decode error', async () => {
      grpc.sendCommand.withArgs('decodePayReq').rejects(new Error('Boom!'));
      const isValid = await payment.decodeInvoice({ invoice: 'some-invoice' });
      await nap(10);
      expect(isValid, 'to be', false);
      expect(store.payment.amount, 'to be', '');
      expect(store.payment.note, 'to be', '');
      expect(store.payment.fee, 'to be', '');
      expect(logger.info, 'was called once');
    });

    it('should set no fee on query route error', async () => {
      grpc.sendCommand.withArgs('decodePayReq').resolves({
        numSatoshis: 1700,
        description: 'foo',
        destination: 'bar',
      });
      grpc.sendCommand.withArgs('queryRoutes').rejects(new Error('Boom!'));
      const isValid = await payment.decodeInvoice({ invoice: 'some-invoice' });
      await nap(10);
      expect(isValid, 'to be', true);
      expect(store.payment.amount, 'to match', /^0[,.]0{4}1{1}7{1}$/);
      expect(store.payment.note, 'to be', 'foo');
      expect(store.payment.fee, 'to be', '');
      expect(logger.info, 'was called once');
    });
  });

  describe('toggleMax()', () => {
    it('should set the payment amount to the wallet balance minus fee', async () => {
      store.payment.address = 'some-address';
      store.balanceSatoshis = 100000;
      grpc.sendCommand.resolves({ feeSat: 100 });
      await payment.toggleMax();
      expect(store.payment.amount, 'to match', /^0[,.]0{3}9{3}$/);
      expect(store.payment.sendAll, 'to be true');
    });

    it('should disable sendAll and reset amount', async () => {
      store.payment.sendAll = true;
      store.payment.amount = 1000;
      store.payment.address = 'some-address';
      store.balanceSatoshis = 100000;
      await payment.toggleMax();
      expect(store.payment.amount, 'to be', '0');
      expect(store.payment.sendAll, 'to be false');
    });
  });

  describe('payBitcoin()', () => {
    it('should send on-chain transaction', async () => {
      store.payment.amount = '0.00001';
      store.payment.address = 'some-address';
      grpc.sendCommand.withArgs('sendCoins').resolves();
      await payment.payBitcoin();
      expect(nav.goWait, 'was called once');
      expect(grpc.sendCommand, 'was called with', 'sendCoins', {
        addr: 'some-address',
        amount: 1000,
        sendAll: false,
      });
      expect(nav.goPayBitcoinDone, 'was called once');
      expect(notification.display, 'was not called');
    });

    it('should set amount to 0 on sendAll', async () => {
      store.payment.sendAll = true;
      store.payment.amount = '0.00001';
      store.payment.address = 'some-address';
      grpc.sendCommand.withArgs('sendCoins').resolves();
      await payment.payBitcoin();
      expect(nav.goWait, 'was called once');
      expect(grpc.sendCommand, 'was called with', 'sendCoins', {
        addr: 'some-address',
        amount: 0,
        sendAll: true,
      });
      expect(nav.goPayBitcoinDone, 'was called once');
      expect(notification.display, 'was not called');
    });

    it('should display notification on error', async () => {
      grpc.sendCommand.withArgs('sendCoins').rejects();
      await payment.payBitcoin();
      expect(nav.goWait, 'was called once');
      expect(nav.goPayBitcoinConfirm, 'was called once');
      expect(notification.display, 'was called once');
    });

    it('should display error notification on timeout', async () => {
      grpc.sendCommand.callsFake(() => nap(50));
      payment.payBitcoin();
      await nap(10);
      expect(nav.goPayBitcoinConfirm, 'was called once');
      expect(notification.display, 'was called once');
      expect(nav.goPayBitcoinDone, 'was not called');
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
      paymentsOnStub.withArgs('data').yields({ paymentError: '' });
      payment.setAddress({ address: 'lightning:some-invoice' });
      await payment.payLightning();
      expect(grpc.sendStreamCommand, 'was called with', 'sendPayment');
      expect(
        paymentsWriteStub,
        'was called with',
        JSON.stringify({ paymentRequest: 'some-invoice' }),
        'utf8'
      );
      expect(nav.goWait, 'was called once');
      expect(nav.goPayLightningDone, 'was called once');
      expect(notification.display, 'was not called');
    });

    it('should display notification on error', async () => {
      paymentsOnStub.withArgs('data').yields({ paymentError: 'Boom!' });
      await payment.payLightning({ invoice: 'some-payment' });
      expect(nav.goPayLightningConfirm, 'was called once');
      expect(notification.display, 'was called once');
    });

    it('should go to error page on timeout', async () => {
      payment.payLightning({ invoice: 'some-invoice' });
      await nap(10);
      expect(nav.goPaymentFailed, 'was called once');
      expect(nav.goPayLightningDone, 'was not called');
    });
  });
});
