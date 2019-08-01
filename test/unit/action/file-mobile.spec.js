import { Store } from '../../../src/store';
import FileAction from '../../../src/action/file-mobile';
import * as logger from '../../../src/action/log';

describe('Action File Mobile Unit Tests', () => {
  let store;
  let sandbox;
  let RNFS;
  let Share;
  let file;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    RNFS = {
      DocumentDirectoryPath: '/foo/bar',
      readFile: sinon.stub().resolves('some-logs'),
      unlink: sinon.stub().resolves(),
    };
    Share = {
      share: sinon.stub().resolves(),
    };
    file = new FileAction(store, RNFS, Share);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getLndDir()', () => {
    it('should get lnd directory', () => {
      const path = file.getLndDir();
      expect(path, 'to equal', '/foo/bar');
    });
  });

  describe('readLogs()', () => {
    it('should read log file contents', async () => {
      store.network = 'mainnet';
      const logs = await file.readLogs();
      expect(logs, 'to equal', 'some-logs');
      expect(
        RNFS.readFile,
        'was called with',
        '/foo/bar/logs/bitcoin/mainnet/lnd.log',
        'utf8'
      );
    });
  });

  describe('shareLogs()', () => {
    beforeEach(() => {
      sandbox.stub(file, 'readLogs');
    });

    it('should invoke the native share api', async () => {
      file.readLogs.resolves('some-logs');
      await file.shareLogs();
      expect(Share.share, 'was called with', {
        title: 'Lightning App logs',
        message: 'some-logs',
      });
    });

    it('should log error if sharing fails', async () => {
      file.readLogs.rejects(new Error('Boom!'));
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
