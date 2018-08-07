import IpcAction from '../../../src/action/ipc';

describe('Action IPC Unit Tests', () => {
  let ipc;
  let sandbox;
  let ipcRendererStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    ipcRendererStub = {
      on: sandbox.stub(),
      once: sandbox.stub(),
      send: sandbox.stub(),
    };
    ipc = new IpcAction(ipcRendererStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('send()', () => {
    const event = 'some-event';
    const listen = 'some-listener';
    const payload = 'some-payload';

    it('should proxy request/response via ipc', async () => {
      ipcRendererStub.once
        .withArgs('some-listener')
        .yields(null, { response: 'some-response' });
      const response = await ipc.send(event, listen, payload);
      expect(response, 'to equal', 'some-response');
      expect(ipcRendererStub.send, 'was called with', event, payload);
    });

    it('should just send a request via ipc', async () => {
      const response = await ipc.send(event, null, payload);
      expect(response, 'to equal', undefined);
      expect(ipcRendererStub.send, 'was called with', event, payload);
      expect(ipcRendererStub.once, 'was not called');
    });

    it('should proxy error via ipc', async () => {
      ipcRendererStub.once
        .withArgs('some-listener')
        .yields(null, { err: new Error('Boom!') });
      await expect(
        ipc.send(event, listen, payload),
        'to be rejected with error satisfying',
        /Boom/
      );
    });
  });

  describe('listen()', () => {
    it('should proxy request/response via ipc', done => {
      const event = 'some-event';
      ipcRendererStub.on
        .withArgs('some-event')
        .yields({ response: 'some-response' });
      ipc.listen(event, data => {
        expect(data.response, 'to equal', 'some-response');
        done();
      });
    });
  });
});
