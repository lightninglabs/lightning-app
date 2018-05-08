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

  describe('toSatoshis()', () => {
    it('should throw error if amount is undefined', () => {
      expect(
        helpers.toSatoshis.bind(null, undefined, 'btc'),
        'to throw',
        /Missing/
      );
    });

    it('should throw error if amount is number', () => {
      expect(helpers.toSatoshis.bind(null, 0.1, 'btc'), 'to throw', /Missing/);
    });

    it('should throw error if unit is undefined', () => {
      expect(
        helpers.toSatoshis.bind(null, '100', undefined),
        'to throw',
        /Missing/
      );
    });

    it('should be 0 for empty amount', () => {
      const num = helpers.toSatoshis('', 'btc');
      expect(num, 'to equal', 0);
    });

    it('should work for string input', () => {
      const num = helpers.toSatoshis('0.10', 'btc');
      expect(num, 'to equal', 10000000);
    });

    it('should have use ony 8 decimal values', () => {
      const num = helpers.toSatoshis('0.000000014', 'btc');
      expect(num, 'to equal', 1);
    });

    it('should round up to two satoshis', () => {
      const num = helpers.toSatoshis('0.000000019', 'btc');
      expect(num, 'to equal', 2);
    });
  });

  describe('toAmount()', () => {
    it('should throw error if satoshis is undefined', () => {
      expect(
        helpers.toAmount.bind(null, undefined, 'btc'),
        'to throw',
        /Missing/
      );
    });

    it('should throw error if satoshis is not a number', () => {
      expect(
        helpers.toAmount.bind(null, 'not-a-number', 'btc'),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for empty input', () => {
      expect(helpers.toAmount.bind(null, '', 'btc'), 'to throw', /Invalid/);
    });

    it('should throw error if unit is undefined', () => {
      expect(
        helpers.toAmount.bind(null, 100, undefined),
        'to throw',
        /Missing/
      );
    });

    it('should work for string input', () => {
      const num = helpers.toAmount('100000000', 'btc');
      expect(num, 'to equal', '1');
    });

    it('should work for number input', () => {
      const num = helpers.toAmount(100000000, 'btc');
      expect(num, 'to equal', '1');
    });

    it('should not format number input', () => {
      const num = helpers.toAmount(100000000000, 'btc');
      expect(num, 'to equal', '1000');
    });

    it('should ingore satoshi decimal values', () => {
      const num = helpers.toAmount(100000000.9, 'btc');
      expect(num, 'to equal', '1');
    });

    it('should use period for decimals values', () => {
      const num = helpers.toAmount(10000000, 'btc');
      expect(num, 'to equal', '0.1');
    });
  });

  describe('calculateExchangeRate()', () => {
    const settings = {
      fiat: 'usd',
      exchangeRate: { usd: 0.00014503 },
    };

    it('should throw error if satoshis is undefined', () => {
      expect(
        helpers.calculateExchangeRate.bind(null, undefined, settings),
        'to throw',
        /Missing/
      );
    });

    it('should work', () => {
      const rate = helpers.calculateExchangeRate(100000, settings);
      expect(rate, 'to match', /6{1}[,.]9{1}0{1}/);
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
