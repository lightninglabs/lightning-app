import * as helpers from '../../src/helper';

describe('Helpers Unit Tests', () => {
  describe('formatNumber()', () => {
    it('should work for undefined', () => {
      const num = helpers.formatNumber();
      expect(num, 'to equal', '');
    });

    it('should work for string input', () => {
      const num = helpers.formatNumber('1000000');
      expect(num.length, 'to equal', 9);
    });

    it('should work for number input', () => {
      const num = helpers.formatNumber(1000000);
      expect(num.length, 'to equal', 9);
    });
  });

  describe('toHash()', () => {
    it('should throw error for undefined', () => {
      expect(helpers.toHash.bind(), 'to throw');
    });

    it('should work for string input', () => {
      const hash = helpers.toHash('foobar');
      expect(hash, 'to equal', '7e8a1b6a');
    });
  });

  describe('reverse()', () => {
    it('should reverse a byte array', () => {
      const src = new Buffer('cdab', 'hex');
      const dest = helpers.reverse(src);
      expect(dest.toString('hex'), 'to equal', 'abcd');
    });
  });
});
