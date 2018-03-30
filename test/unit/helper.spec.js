import * as helpers from '../../src/helper';

describe('Helpers Unit Tests', () => {
  describe('formatNumber()', () => {
    it('should work for undefined', () => {
      const num = helpers.formatNumber(undefined);
      expect(num, 'to equal', '0');
    });

    it('should work for NaN', () => {
      const num = helpers.formatNumber(NaN);
      expect(num, 'to equal', '0');
    });

    it('should work for null', () => {
      const num = helpers.formatNumber(null);
      expect(num, 'to equal', '0');
    });

    it('should work for string input', () => {
      const num = helpers.formatNumber('1000000');
      expect(num, 'to match', /^1[,.]0{3}[,.]0{3}$/);
    });

    it('should work for number input', () => {
      const num = helpers.formatNumber(1000000);
      expect(num, 'to match', /^1[,.]0{3}[,.]0{3}$/);
    });

    it('should have 8 decimal values max', () => {
      const num = helpers.formatNumber(0.000000011);
      expect(num, 'to match', /^0[,.]0{7}1{1}$/);
    });
  });
  describe('formatFiat()', () => {
    it('should work for undefined', () => {
      const num = helpers.formatFiat(undefined, 'usd');
      expect(num, 'to match', /0[,.]0{2}/);
    });

    it('should work for NaN', () => {
      const num = helpers.formatFiat(NaN, 'usd');
      expect(num, 'to match', /0[,.]0{2}/);
    });

    it('should work for null', () => {
      const num = helpers.formatFiat(null, 'usd');
      expect(num, 'to match', /0[,.]0{2}/);
    });

    it('should work for string input', () => {
      const num = helpers.formatFiat('1000000', 'usd');
      expect(num, 'to match', /1[,.]0{3}[,.]0{3}[,.]0{2}/);
      expect(num, 'to match', /\${1}/);
    });

    it('should work for number input', () => {
      const num = helpers.formatFiat(1000000, 'usd');
      expect(num, 'to match', /1[,.]0{3}[,.]0{3}[,.]0{2}/);
      expect(num, 'to match', /\${1}/);
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
