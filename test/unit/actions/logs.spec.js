import * as log from '../../../src/actions/logs';

describe('Actions Logs Unit Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('info()', () => {
    it('should call console.log with all args', () => {
      log.info('foo', 'bar', 'baz');
      expect(console.log, 'was called with', 'foo', 'bar', 'baz');
    });
  });

  describe('error()', () => {
    it('should call console.error with all args', () => {
      const err = new Error('bar');
      log.error('foo', err);
      expect(console.error, 'was called with', 'foo', err);
    });
  });
});
