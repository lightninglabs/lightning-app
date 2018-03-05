import { observable, useStrict } from 'mobx';
import ActionsNav from '../../../src/actions/nav';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsWallet from '../../../src/actions/wallet';
import nock from 'nock';
import 'isomorphic-fetch';

describe('Actions Wallet Unit Tests', () => {
  let store;
  let actionsNav;
  let actionsGrpc;
  let actionsWallet;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      lndReady: false,
      loaded: false,
      settings: {},
      save: sinon.stub(),
    });
    require('../../../src/config').RETRY_DELAY = 1;
    nock('https://api.ipify.org')
      .get('/')
      .query({ format: 'json' })
      .reply(200, { ip: '0.0.0.0' });
    actionsNav = sinon.createStubInstance(ActionsNav);
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsWallet = new ActionsWallet(store, actionsGrpc, actionsNav);
  });

  describe('initializeWallet()', () => {
    it('should initialize wallet if no seed present', () => {
      store.settings.seedMnemonic = undefined;
      actionsWallet.initializeWallet();
      expect(actionsNav.goInitializeWallet, 'was called once');
    });

    it('should go to pay view if seed is present', () => {
      store.settings.seedMnemonic =
        'milk notable immune soap mechanic urge food innocent heavy orbit alcohol people';
      actionsWallet.initializeWallet();
      expect(actionsNav.goPay, 'was not called');
    });
  });

  describe('getBalance()', () => {
    it('should get wallet balance', async () => {
      actionsGrpc.sendCommand.withArgs('WalletBalance').resolves({
        total_balance: 1,
        confirmed_balance: 2,
        unconfirmed_balance: 3,
      });
      await actionsWallet.getBalance();
      expect(store.balanceSatoshis, 'to equal', 1);
      expect(store.confirmedBalanceSatoshis, 'to equal', 2);
      expect(store.unconfirmedBalanceSatoshis, 'to equal', 3);
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsWallet.getBalance();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getChannelBalance()', () => {
    it('should get channel balance', async () => {
      actionsGrpc.sendCommand
        .withArgs('ChannelBalance')
        .resolves({ balance: 1 });
      await actionsWallet.getChannelBalance();
      expect(store.channelBalanceSatoshis, 'to equal', 1);
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsWallet.getChannelBalance();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('generatePaymentRequest()', () => {
    it('should add invoice and return payment request', async () => {
      actionsGrpc.sendCommand.withArgs('addInvoice').resolves({
        payment_request: 'some-request',
      });
      const request = await actionsWallet.generatePaymentRequest(
        42,
        'some-note'
      );
      expect(request, 'to equal', 'lightning:some-request');
    });
  });

  describe('getNewAddress()', () => {
    it('should get new address', async () => {
      actionsGrpc.sendCommand.withArgs('NewAddress').resolves({
        address: 'some-address',
      });
      await actionsWallet.getNewAddress();
      expect(store.walletAddress, 'to equal', 'some-address');
    });

    it('should retry on failure', async () => {
      actionsGrpc.sendCommand.onFirstCall().rejects();
      await actionsWallet.getNewAddress();
      actionsGrpc.sendCommand.resolves({});
      await nap(30);
      expect(actionsGrpc.sendCommand.callCount, 'to be greater than', 1);
    });
  });

  describe('getIPAddress()', () => {
    it('should return IP correctly', async () => {
      await actionsWallet.getIPAddress();
      expect(store.ipAddress, 'to be', '0.0.0.0');
    });
  });
});
