import { observable, useStrict } from 'mobx';
import * as log from '../../../src/action/logs';
import LogAction from '../../../src/action/logs';

describe('Action Logs Unit Tests', () => {
  let store;
  let sandbox;
  let ipcRenderer;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
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

  describe('with constructor', () => {
    beforeEach(() => {
      useStrict(false);
      store = observable({ logs: [] });
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
        expect(ipcRenderer.send, 'was called with', 'log-error', ['foo', err]);
      });
    });
  });
});
