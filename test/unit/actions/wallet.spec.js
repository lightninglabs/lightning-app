import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsWallet from '../../../src/actions/wallet';
import nock from 'nock';
import 'isomorphic-fetch';

describe('Actions Wallet Unit Tests', () => {
  let store;
  let actionsGrpc;
  let actionsWallet;

  beforeEach(() => {
    useStrict(false);
    store = observable({
      lndReady: false,
      loaded: true,
    });
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsGrpc.sendCommand.resolves({});
    actionsWallet = new ActionsWallet(store, actionsGrpc, null);
  });

  describe('getIPAddress()', () => {
    it('it should return IP correctly', async () => {
      nock('https://api.ipify.org')
        .get('/')
        .query({ format: 'json' })
        .reply(200, { ip: '0.0.0.0' });
      await actionsWallet.getIPAddress();
      expect(actionsWallet._store.ipAddress, 'to be', '0.0.0.0');
    });
  });
});
