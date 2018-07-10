import { Store } from '../../../src/store';
import { EventEmitter } from 'events';
import * as log from '../../../src/action/log';
import LogAction from '../../../src/action/log';

describe('Action Logs Unit Tests', () => {
  let store;
  let sandbox;
  let ipcRenderer;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    ipcRenderer = {
      send: sinon.stub(),
      on: sinon.stub().yields('some-event', 'some-arg'),
    };
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
        sandbox.restore();
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
      new LogAction(store, ipcRendererStub);
    });

    describe('constructor()', () => {
      it('should keep logs trimmed and keep the tail of the logs', () => {
        for (var i = 0; i < 31; i++) {
          ipcRendererStub.emit('logs', 'some-event', i.toString());
        }
        expect(store.logs.length, 'to equal', 30);
        expect(store.logs[0], 'to equal', '1');
        expect(store.logs[29], 'to equal', '30');
      });
    });
  });

  describe('with constructor', () => {
    beforeEach(() => {
      store = new Store();
      new LogAction(store, ipcRenderer);
    });

    describe('constructor()', () => {
      it('should append log on ipcRenderer logs event', () => {
        expect(store.logs[0], 'to equal', 'some-arg');
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
        sandbox.restore();
        expect(store.logs.length, 'to equal', 3);
        expect(ipcRenderer.send, 'was called with', 'log-error', ['foo', err]);
      });
    });
  });
});
