import { Store } from '../../../src/store';
import FileAction from '../../../src/action/file-mobile';
import * as logger from '../../../src/action/log';

describe('Action File Mobile Unit Tests', () => {
  let store;
  let sandbox;
  let RNFS;
  let RNShare;
  let file;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    store.network = 'mainnet';
    RNFS = {
      DocumentDirectoryPath: '/foo/bar',
      readFile: sinon.stub().resolves('some-logs'),
      unlink: sinon.stub().resolves(),
    };
    RNShare = {
      open: sinon.stub().resolves(),
    };
    file = new FileAction(store, RNFS, RNShare);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('get lndDir()', () => {
    it('should get lnd directory', () => {
      const path = file.lndDir;
      expect(path, 'to equal', '/foo/bar');
    });
  });

  describe('get logsPath()', () => {
    it('should get log file path', () => {
      const path = file.logsPath;
      expect(path, 'to equal', '/foo/bar/logs/bitcoin/mainnet/lnd.log');
    });
  });

  describe('shareLogs()', () => {
    it('should invoke the native share api', async () => {
      await file.shareLogs();
      expect(RNShare.open, 'was called once');
    });

    it('should log error if sharing fails', async () => {
      RNShare.open.rejects(new Error('Boom!'));
      await file.shareLogs();
      expect(logger.error, 'was called once');
    });
  });

  describe('deleteWalletDB()', () => {
    it('should delete wallet db file', async () => {
      await file.deleteWalletDB('mainnet');
      expect(
        RNFS.unlink,
        'was called with',
        '/foo/bar/data/chain/bitcoin/mainnet/wallet.db'
      );
    });

    it('should log error if deleting fails', async () => {
      RNFS.unlink.rejects(new Error('Boom!'));
      await file.deleteWalletDB('mainnet');
      expect(logger.info, 'was called once');
    });
  });
});
