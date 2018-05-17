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

  describe('parseSat()', () => {
    it('should throw error if satoshis is undefined', () => {
      expect(helpers.parseSat.bind(null, undefined), 'to throw', /Invalid/);
    });

    it('should throw error if satoshis is null', () => {
      expect(helpers.parseSat.bind(null, null), 'to throw', /Invalid/);
    });

    it('should throw error for empty satoshis', () => {
      expect(helpers.parseSat.bind(null, ''), 'to throw', /Invalid/);
    });

    it('should throw error if satoshis is not a number', () => {
      expect(
        helpers.parseSat.bind(null, 'not-a-number'),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for string decimal values', () => {
      expect(helpers.parseSat.bind(null, '100000000.9'), 'to throw', /Invalid/);
    });

    it('should work for single char', () => {
      const num = helpers.parseSat('0');
      expect(num, 'to equal', 0);
    });

    it('should work for single char', () => {
      const num = helpers.parseSat('1');
      expect(num, 'to equal', 1);
    });

    it('should work for string input', () => {
      const num = helpers.parseSat('100000000');
      expect(num, 'to equal', 100000000);
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

    it('should throw error if amount is null', () => {
      expect(helpers.toSatoshis.bind(null, null, 'btc'), 'to throw', /Missing/);
    });

    it('should throw error if amount is number', () => {
      expect(helpers.toSatoshis.bind(null, 0.1, 'btc'), 'to throw', /Missing/);
    });

    it('should throw error if amount is separated with a comma', () => {
      expect(
        helpers.toSatoshis.bind(null, '0,1', 'btc'),
        'to throw',
        /Missing/
      );
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
        /Invalid/
      );
    });

    it('should throw error if satoshis is null', () => {
      expect(helpers.toAmount.bind(null, null, 'btc'), 'to throw', /Invalid/);
    });

    it('should throw error if satoshis is not a number', () => {
      expect(
        helpers.toAmount.bind(null, 'not-a-number', 'btc'),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for string number', () => {
      expect(helpers.toAmount.bind(null, '100', 'btc'), 'to throw', /Invalid/);
    });

    it('should throw error if unit is invalid', () => {
      expect(
        helpers.toAmount.bind(null, 100, 'not-a-unit'),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if unit is undefined', () => {
      expect(
        helpers.toAmount.bind(null, 100, undefined),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for non-integer numbers', () => {
      expect(
        helpers.toAmount.bind(null, 100000000.9, 'btc'),
        'to throw',
        /Invalid/
      );
    });

    it('should work for number input', () => {
      const num = helpers.toAmount(100000000, 'btc');
      expect(num, 'to equal', '1');
    });

    it('should not format number input', () => {
      const num = helpers.toAmount(100000000000, 'btc');
      expect(num, 'to equal', '1000');
    });

    it('should use period for decimals values', () => {
      const num = helpers.toAmount(10000000, 'btc');
      expect(num, 'to equal', '0.1');
    });

    it('should work for 0', () => {
      const num = helpers.toAmount(0, 'btc');
      expect(num, 'to equal', '0');
    });
  });

  describe('calculateExchangeRate()', () => {
    const settings = {
      fiat: 'usd',
      exchangeRate: { usd: 0.00014503 },
      displayFiat: true,
    };

    it('should throw error if satoshis is undefined', () => {
      expect(
        helpers.calculateExchangeRate.bind(null, undefined, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is null', () => {
      expect(
        helpers.calculateExchangeRate.bind(null, null, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is string', () => {
      expect(
        helpers.calculateExchangeRate.bind(null, '100000', settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for non-integer numbers', () => {
      expect(
        helpers.calculateExchangeRate.bind(null, 100000000.9, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if settings is undefined', () => {
      expect(
        helpers.calculateExchangeRate.bind(null, 100000, undefined),
        'to throw',
        /Cannot read property/
      );
    });

    it('should throw error if settings is invalid', () => {
      expect(
        helpers.calculateExchangeRate.bind(null, 100000, {}),
        'to throw',
        /Invalid/
      );
    });

    it('should work for a number value', () => {
      const rate = helpers.calculateExchangeRate(100000, settings);
      expect(rate, 'to match', /6{1}[,.]9{1}0{1}/);
    });
  });

  describe('toAmountLabel()', () => {
    let settings;

    beforeEach(() => {
      settings = {
        unit: 'btc',
        fiat: 'usd',
        exchangeRate: { usd: 0.00014503 },
        displayFiat: true,
      };
    });

    it('should throw error if satoshis is undefined for fiat', () => {
      expect(
        helpers.toAmountLabel.bind(null, undefined, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is null for fiat', () => {
      expect(
        helpers.toAmountLabel.bind(null, null, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is empty for fiat', () => {
      expect(
        helpers.toAmountLabel.bind(null, '', settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is undefined for amount', () => {
      settings.displayFiat = false;
      expect(
        helpers.toAmountLabel.bind(null, undefined, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is string value', () => {
      settings.displayFiat = false;
      expect(
        helpers.toAmountLabel.bind(null, '100000', settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if settings is undefined', () => {
      expect(
        helpers.toAmountLabel.bind(null, 100000, undefined),
        'to throw',
        /Cannot read property/
      );
    });

    it('should throw error if settings is invalid', () => {
      expect(
        helpers.toAmountLabel.bind(null, 100000, {}),
        'to throw',
        /Invalid/
      );
    });

    it('should convert number value to fiat', () => {
      const lbl = helpers.toAmountLabel(100000, settings);
      expect(lbl, 'to match', /6{1}[,.]9{1}0{1}/);
    });

    it('should format a number value', () => {
      settings.displayFiat = false;
      const lbl = helpers.toAmountLabel(100000, settings);
      expect(lbl, 'to match', /0{1}[,.]0{2}1{1}/);
    });
  });

  describe('toCaps()', () => {
    it('should work for undefined', () => {
      const caps = helpers.toCaps(undefined);
      expect(caps, 'to equal', '');
    });

    it('should work for empty input', () => {
      const caps = helpers.toCaps('');
      expect(caps, 'to equal', '');
    });

    it('should work for single char input', () => {
      const caps = helpers.toCaps('a');
      expect(caps, 'to equal', 'A');
    });

    it('should work for a single word', () => {
      const caps = helpers.toCaps('foo');
      expect(caps, 'to equal', 'Foo');
    });

    it('should work for two word inputs', () => {
      const caps = helpers.toCaps('foo-bar');
      expect(caps, 'to equal', 'Foo Bar');
    });

    it('should work for three word inputs', () => {
      const caps = helpers.toCaps('foo-bar-baz');
      expect(caps, 'to equal', 'Foo Bar Baz');
    });

    it('should work for string input with separator', () => {
      const caps = helpers.toCaps('foo-bar-baz', '');
      expect(caps, 'to equal', 'FooBarBaz');
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
      const src = Buffer.from('cdab', 'hex');
      const dest = helpers.reverse(src);
      expect(dest.toString('hex'), 'to equal', 'abcd');
    });
  });

  describe('checkHttpStatus()', () => {
    it('should throw error for 500', () => {
      const response = { status: 500, statusText: 'Boom!' };
      expect(helpers.checkHttpStatus.bind(null, response), 'to throw', /Boom/);
    });

    it('should return response for 200', () => {
      const response = { status: 200 };
      const res = helpers.checkHttpStatus(response);
      expect(res, 'to equal', response);
    });
  });
});
