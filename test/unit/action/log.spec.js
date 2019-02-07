import { Store } from '../../../src/store';
import { EventEmitter } from 'events';
import * as log from '../../../src/action/log';
import IpcAction from '../../../src/action/ipc';
import LogAction from '../../../src/action/log';

describe('Action Logs Unit Tests', () => {
  let store;
  let sandbox;
  let ipc;
  let ipcRenderer;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    ipcRenderer = {
      send: sinon.stub(),
      on: sinon.stub().yields('some-event', 'some-arg'),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('without constructor', () => {
    describe('info()', () => {
      it('should call console.log with all args', () => {
        sandbox.stub(console, 'log');
        log.info('foo', 'bar', 'baz');
        expect(console.log, 'was called with', 'foo', 'bar', 'baz');
        sandbox.restore();
        expect(ipcRenderer.send, 'was not called');
      });
    });

    describe('error()', () => {
      it('should call console.error with all args', () => {
        const err = new Error('bar');
        sandbox.stub(console, 'error');
        log.error('foo', err);
        expect(console.error, 'was called with', 'foo', err);
        expect(ipcRenderer.send, 'was not called');
      });
    });
  });

  describe('constructor', () => {
    let ipcRendererStub;

    beforeEach(() => {
      store = new Store();
      ipcRendererStub = new EventEmitter();
      ipcRendererStub.send = sinon.stub();
      ipc = new IpcAction(ipcRendererStub);
      new LogAction(store, ipc);
    });

    describe('constructor()', () => {
      it('should keep logs trimmed and keep the tail of the logs', () => {
        for (var i = 0; i < 10001; i++) {
          ipcRendererStub.emit('logs', 'some-event', i.toString());
        }
        const len = store.logs.length;
        expect(store.logs.substring(len - 5, len), 'to equal', '10000');
        expect(store.logs.length, 'to equal', 10000);
      });
    });
  });

  describe('with constructor', () => {
    beforeEach(() => {
      store = new Store();
      ipc = new IpcAction(ipcRenderer);
      new LogAction(store, ipc);
    });

    describe('constructor()', () => {
      it('should append log on ipcRenderer logs event', () => {
        expect(store.logs, 'to equal', '\nsome-arg');
      });
    });

    describe('info()', () => {
      it('should call console.log with all args', () => {
        sandbox.stub(console, 'log');
        log.info('foo', 'bar', 'baz');
        expect(console.log, 'was called with', 'foo', 'bar', 'baz');
        sandbox.restore();
        expect(ipcRenderer.send, 'was called with', 'log', [
          'foo',
          'bar',
          'baz',
        ]);
      });
    });

    describe('error()', () => {
      it('should call console.error with all args', () => {
        const err = new Error('bar');
        sandbox.stub(console, 'error');
        log.error('foo', err);
        expect(console.error, 'was called with', 'foo', err);
        expect(store.logs.length, 'to equal', 25);
        expect(ipcRenderer.send, 'was called with', 'log-error', ['foo', err]);
      });
    });

    describe('error()', () => {
      it('should call console.error with all args', () => {
        new LogAction(store, ipc, false);
        const err = new Error('bar');
        sandbox.stub(console, 'error');
        log.error('foo', err);
        expect(console.error, 'was called with', 'foo', err);
        expect(store.logs.length, 'to equal', 56);
      });
    });
  });
});
