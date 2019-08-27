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
      ExternalStorageDirectoryPath: '/bar/baz',
      readFile: sinon.stub().resolves('some-data'),
      unlink: sinon.stub().resolves(),
      copyFile: sinon.stub(),
      exists: sinon.stub(),
      mkdir: sinon.stub(),
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

  describe('get externalStorageDir()', () => {
    it('should get external storage directory', () => {
      const path = file.externalStorageDir;
      expect(path, 'to equal', '/bar/baz');
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

  describe('get scbPath()', () => {
    it('should get scb file path', () => {
      const path = file.scbPath;
      expect(
        path,
        'to equal',
        '/foo/bar/data/chain/bitcoin/mainnet/channel.backup'
      );
    });
  });

  describe('get scbExternalDir()', () => {
    it('should get external scb directory', () => {
      const path = file.scbExternalDir;
      expect(path, 'to equal', '/bar/baz/Lightning/mainnet');
    });
  });

  describe('get scbExternalPath()', () => {
    it('should get external scb file path', () => {
      const path = file.scbExternalPath;
      expect(path, 'to equal', '/bar/baz/Lightning/mainnet/channel.backup');
    });
  });

  describe('get readSCB()', () => {
    it('should read data from fs', async () => {
      expect(await file.readSCB(), 'to equal', 'some-data');
    });
  });

  describe('get copySCBToExternalStorage()', () => {
    it('should copy the scb if it exists', async () => {
      RNFS.exists.resolves(true);
      await file.copySCBToExternalStorage();
      expect(RNFS.mkdir, 'was called once');
      expect(RNFS.copyFile, 'was called once');
    });

    it('should not copy the scb if it does not exist', async () => {
      RNFS.exists.resolves(false);
      await file.copySCBToExternalStorage();
      expect(RNFS.mkdir, 'was not called');
      expect(RNFS.copyFile, 'was not called');
    });
  });

  describe('get readSCBFromExternalStorage()', () => {
    it('should read the scb if it exists', async () => {
      RNFS.exists.resolves(true);
      expect(await file.readSCBFromExternalStorage(), 'to equal', 'some-data');
    });

    it('should not read the scb if it does not exist', async () => {
      RNFS.exists.resolves(false);
      expect(await file.readSCBFromExternalStorage(), 'to equal', undefined);
    });
  });
});
