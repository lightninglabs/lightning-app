import BackupAction from '../../../src/action/backup-mobile';
import FileAction from '../../../src/action/file-mobile';
import GrpcAction from '../../../src/action/grpc';
import * as logger from '../../../src/action/log';

describe('Action Backup Mobile Unit Tests', () => {
  let sandbox;
  let iCloudStorage;
  let Permissions;
  let grpc;
  let file;
  let Platform;
  let DeviceInfo;
  let backup;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    iCloudStorage = {
      getItem: sinon.stub().resolves('some-value'),
      setItem: sinon.stub().resolves(),
    };
    Permissions = {
      request: sinon.stub().resolves(true),
      PERMISSIONS: {
        WRITE_EXTERNAL_STORAGE: true,
      },
      RESULTS: { GRANTED: true },
    };
    DeviceInfo = {
      getUniqueID: sinon.stub().returns('FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9'),
      getDeviceId: sinon.stub().returns('iPhone7,2'),
    };
    file = sinon.createStubInstance(FileAction);
    grpc = sinon.createStubInstance(GrpcAction);
    Platform = { OS: 'ios' };
    backup = new BackupAction(
      grpc,
      file,
      Platform,
      DeviceInfo,
      Permissions,
      iCloudStorage
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('pushChannelBackup', async () => {
    it('should store the SCB on iCloud', async () => {
      file.readSCB.resolves('some-scb');
      await backup.pushChannelBackup();
      expect(logger.error, 'was not called');
      expect(
        iCloudStorage.setItem,
        'was called with',
        'fcdbd8e_channel.backup',
        /^{"device":"iPhone7,2","data":"some-scb","time":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"}$/
      );
    });

    it('should log error if reading file fails', async () => {
      file.readSCB.rejects('some-error');
      await backup.pushChannelBackup();
      expect(logger.error, 'was called once');
      expect(iCloudStorage.setItem, 'was not called');
    });

    it('should log error if iCloud storage fails', async () => {
      file.readSCB.resolves('some-scb');
      iCloudStorage.setItem.rejects('some-error');
      await backup.pushChannelBackup();
      expect(logger.error, 'was called once');
    });

    it('should copy SCB to external storage', async () => {
      Platform.OS = 'android';
      await backup.pushChannelBackup();
      expect(Permissions.request, 'was called once');
      expect(file.copySCBToExternalStorage, 'was called once');
      expect(logger.error, 'was not called');
    });

    it('should log if permission is denied', async () => {
      Platform.OS = 'android';
      Permissions.request.resolves(false);
      await backup.pushChannelBackup();
      expect(Permissions.request, 'was called once');
      expect(logger.info, 'was called once');
      expect(file.copySCBToExternalStorage, 'was not called');
    });

    it('should log error if external storage fails', async () => {
      Platform.OS = 'android';
      file.copySCBToExternalStorage.rejects('some-error');
      await backup.pushChannelBackup();
      expect(logger.error, 'was called once');
    });
  });

  describe('fetchChannelBackup', async () => {
    const backupJson =
      '{"device":"iPhone7,2","data":"c29tZS1zY2I=","time":"2019-08-08T15:44:53.429Z"}';

    it('should log error if external storage fails', async () => {
      Platform.OS = 'ios';
      iCloudStorage.getItem.resolves(backupJson);
      const buf = await backup.fetchChannelBackup();
      expect(buf.toString(), 'to equal', 'some-scb');
    });

    it('should log error if external storage fails', async () => {
      Platform.OS = 'android';
      file.readSCBFromExternalStorage.resolves('c29tZS1zY2I=');
      const buf = await backup.fetchChannelBackup();
      expect(buf.toString(), 'to equal', 'some-scb');
    });
  });

  describe('subscribeChannelBackups()', async () => {
    let onStub;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(backup, 'pushChannelBackup');
    });

    it('should push to iCloud on backup update', async () => {
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeChannelBackups')
        .returns({ on: onStub });
      await backup.subscribeChannelBackups();
      expect(backup.pushChannelBackup, 'was called once');
    });

    it('should log error in case of error', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      grpc.sendStreamCommand
        .withArgs('subscribeChannelBackups')
        .returns({ on: onStub });
      await backup.subscribeChannelBackups();
      expect(logger.error, 'was called once');
    });
  });
});
