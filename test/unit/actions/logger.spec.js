import * as logger from '../../../src/actions/logger';

describe('Logger Unit Tests', () => {
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
      logger.info('foo', 'bar', 'baz');
      expect(console.log, 'was called with', 'foo', 'bar', 'baz');
    });
  });

  describe('error()', () => {
    it('should call console.error with all args', () => {
      const err = new Error('bar');
      logger.error('foo', err);
      expect(console.error, 'was called with', 'foo', err);
    });
  });
});
