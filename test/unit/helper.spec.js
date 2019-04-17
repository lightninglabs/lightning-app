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

    it('should display one cent', () => {
      const num = helpers.formatFiat(0.01, 'usd');
      expect(num, 'to match', /0[,.]0{1}1{1}/);
      expect(num, 'to match', /\${1}/);
      expect(num, 'not to match', /^< /);
    });

    it('should round up to one cent', () => {
      const num = helpers.formatFiat(0.005, 'usd');
      expect(num, 'to match', /0[,.]0{1}1{1}/);
      expect(num, 'to match', /\${1}/);
      expect(num, 'not to match', /^< /);
    });

    it('should display less than a cent', () => {
      const num = helpers.formatFiat(0.004, 'usd');
      expect(num, 'to match', /0[,.]0{1}1{1}/);
      expect(num, 'to match', /\${1}/);
      expect(num, 'to match', /^< /);
    });

    it('should display less than a cent for small numbers', () => {
      const num = helpers.formatFiat(0.0000001, 'usd');
      expect(num, 'to match', /0[,.]0{1}1{1}/);
      expect(num, 'to match', /\${1}/);
      expect(num, 'to match', /^< /);
    });

    it('should display less than a cent for negative small numbers', () => {
      const num = helpers.formatFiat(0.999999 - 1, 'usd');
      expect(num, 'to match', /0[,.]0{1}1{1}/);
      expect(num, 'to match', /\${1}/);
      expect(num, 'to match', /^< -/);
    });

    it('should display 0.00 without less than', () => {
      const num = helpers.formatFiat(0.0, 'usd');
      expect(num, 'to match', /0[,.]0{2}/);
      expect(num, 'to match', /\${1}/);
      expect(num, 'not to match', /^< /);
    });
  });

  describe('parseDate()', () => {
    it('should throw error if timeStamp is undefined', () => {
      expect(helpers.parseDate.bind(null, undefined), 'to throw', /Invalid/);
    });

    it('should throw error if timeStamp is null', () => {
      expect(helpers.parseDate.bind(null, null), 'to throw', /Invalid/);
    });

    it('should throw error for empty timeStamp', () => {
      expect(helpers.parseDate.bind(null, ''), 'to throw', /Invalid/);
    });

    it('should throw error if timeStamp is not a number', () => {
      expect(
        helpers.parseDate.bind(null, 'not-a-number'),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for decimal values', () => {
      expect(helpers.parseDate.bind(null, 100000.9), 'to throw', /Invalid/);
    });

    it('should work for single char', () => {
      const date = helpers.parseDate(0);
      expect(date.toISOString(), 'to equal', '1970-01-01T00:00:00.000Z');
    });

    it('should work for single char', () => {
      const date = helpers.parseDate(1);
      expect(date.toISOString(), 'to equal', '1970-01-01T00:00:01.000Z');
    });

    it('should work for number input', () => {
      const date = helpers.parseDate(1527070395);
      expect(date.toISOString(), 'to equal', '2018-05-23T10:13:15.000Z');
    });
  });

  describe('toSatoshis()', () => {
    let settings;

    beforeEach(() => {
      settings = {
        displayFiat: false,
        unit: 'btc',
        fiat: 'usd',
        exchangeRate: { usd: 0.00014503 },
      };
    });

    it('should throw error if amount is undefined', () => {
      expect(
        helpers.toSatoshis.bind(null, undefined, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if amount is null', () => {
      expect(
        helpers.toSatoshis.bind(null, null, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if amount is number', () => {
      expect(
        helpers.toSatoshis.bind(null, 0.1, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if amount is separated with a comma', () => {
      expect(
        helpers.toSatoshis.bind(null, '0,1', settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if settings is undefined', () => {
      expect(
        helpers.toSatoshis.bind(null, '100', undefined),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for wrong settings', () => {
      expect(helpers.toSatoshis.bind(null, '100', {}), 'to throw', /Invalid/);
    });

    it('should be 0 for empty amount', () => {
      const num = helpers.toSatoshis('', settings);
      expect(num, 'to equal', 0);
    });

    it('should work for string amount', () => {
      const num = helpers.toSatoshis('0.10', settings);
      expect(num, 'to equal', 10000000);
    });

    it('should have use ony 8 decimal values', () => {
      const num = helpers.toSatoshis('0.000000014', settings);
      expect(num, 'to equal', 1);
    });

    it('should round up to two satoshis', () => {
      const num = helpers.toSatoshis('0.000000019', settings);
      expect(num, 'to equal', 2);
    });

    it('should be 0 is exchange rate is not set (fiat)', () => {
      settings.displayFiat = true;
      settings.fiat = 'invalid';
      const num = helpers.toSatoshis('100', settings);
      expect(num, 'to equal', 0);
    });

    it('should be 0 for empty amount (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toSatoshis('', settings);
      expect(num, 'to equal', 0);
    });

    it('should work for string amount (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toSatoshis('10.00', settings);
      expect(num, 'to equal', 145030);
    });
  });

  describe('toAmount()', () => {
    let settings;

    beforeEach(() => {
      settings = {
        displayFiat: false,
        unit: 'btc',
        fiat: 'usd',
        exchangeRate: { usd: 0.00014503 },
      };
    });

    it('should throw error if satoshis is undefined', () => {
      expect(
        helpers.toAmount.bind(null, undefined, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is null', () => {
      expect(
        helpers.toAmount.bind(null, null, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if satoshis is not a number', () => {
      expect(
        helpers.toAmount.bind(null, 'not-a-number', settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error for string number', () => {
      expect(
        helpers.toAmount.bind(null, '100', settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if unit is invalid', () => {
      expect(
        helpers.toAmount.bind(null, 100, 'not-a-unit'),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if settings is undefined', () => {
      expect(
        helpers.toAmount.bind(null, 100, undefined),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if settings is invalid', () => {
      expect(helpers.toAmount.bind(null, 100, {}), 'to throw', /Invalid/);
    });

    it('should throw error for non-integer numbers', () => {
      expect(
        helpers.toAmount.bind(null, 100000000.9, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should work for number input', () => {
      const num = helpers.toAmount(100000000, settings);
      expect(num, 'to equal', '1');
    });

    it('should not format number input', () => {
      const num = helpers.toAmount(100000000000, settings);
      expect(num, 'to equal', '1000');
    });

    it('should use period for decimals values', () => {
      const num = helpers.toAmount(10000000, settings);
      expect(num, 'to equal', '0.1');
    });

    it('should work for 0', () => {
      const num = helpers.toAmount(0, settings);
      expect(num, 'to equal', '0');
    });

    it('should work for 1', () => {
      const num = helpers.toAmount(1, settings);
      expect(num, 'to equal', '0.00000001');
    });

    it('should work for 10', () => {
      const num = helpers.toAmount(10, settings);
      expect(num, 'to equal', '0.0000001');
    });

    it('should work for 100', () => {
      const num = helpers.toAmount(100, settings);
      expect(num, 'to equal', '0.000001');
    });

    it('should work for 1000', () => {
      const num = helpers.toAmount(1000, settings);
      expect(num, 'to equal', '0.00001');
    });

    it('should be infinity if exchange rate is not set (fiat)', () => {
      settings.displayFiat = true;
      settings.fiat = 'invalid-fiat';
      const rate = helpers.toAmount(100, settings);
      expect(rate, 'to match', /∞/);
    });

    it('should work for number input (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toAmount(100000, settings);
      expect(num, 'to equal', '6.89512515');
    });

    it('should work for number input (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toAmount(100000, settings, 2);
      expect(num, 'to equal', '6.90');
    });

    it('should use period for decimals values (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toAmount(100000000, settings);
      expect(num, 'to equal', '6895.12514652');
    });

    it('should work for 0 (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toAmount(0, settings);
      expect(num, 'to equal', '0.00');
    });

    it('should work for 1 (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toAmount(1, settings);
      expect(num, 'to equal', '0.00006895');
    });

    it('should work for 1000 (fiat)', () => {
      settings.displayFiat = true;
      const num = helpers.toAmount(1000, settings);
      expect(num, 'to equal', '0.06895125');
    });
  });

  describe('calculateExchangeRate()', () => {
    let settings;

    beforeEach(() => {
      settings = {
        fiat: 'usd',
        exchangeRate: { usd: 0.00014503 },
        displayFiat: true,
      };
    });

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
      expect(rate, 'to equal', 6.8951251465214085);
    });

    it('should be infinite for unknown rate', () => {
      settings.fiat = 'eur';
      const rate = helpers.calculateExchangeRate(100000, settings);
      expect(rate, 'to equal', Infinity);
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

  describe('toLabel()', () => {
    let settings;

    beforeEach(() => {
      settings = {
        unit: 'btc',
        fiat: 'usd',
        exchangeRate: { usd: 0.00014503 },
        displayFiat: true,
      };
    });

    it('should throw error if amount is undefined', () => {
      expect(
        helpers.toLabel.bind(null, undefined, settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if amount is null', () => {
      expect(helpers.toLabel.bind(null, null, settings), 'to throw', /Invalid/);
    });

    it('should throw error if amount is number', () => {
      expect(helpers.toLabel.bind(null, 0.1, settings), 'to throw', /Invalid/);
    });

    it('should throw error if amount is separated with a comma', () => {
      expect(
        helpers.toLabel.bind(null, '0,1', settings),
        'to throw',
        /Invalid/
      );
    });

    it('should throw error if unit is undefined', () => {
      expect(
        helpers.toLabel.bind(null, '100', undefined),
        'to throw',
        /Invalid/
      );
    });

    it('should be 0 for empty amount', () => {
      const num = helpers.toLabel('', settings);
      expect(num, 'to match', /0{1}[,.]0{2}/);
    });

    it('should work for fiat amount', () => {
      const num = helpers.toLabel('0.10', settings);
      expect(num, 'to match', /0[,.]10/);
    });
    it('should work for btc amount', () => {
      settings.displayFiat = false;
      const lbl = helpers.toLabel('0.10', settings);
      expect(lbl, 'to match', /^0[,.]1$/);
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

    it('should work for string input with separator', () => {
      const caps = helpers.toCaps('foo-bar-baz', ' ');
      expect(caps, 'to equal', 'Foo Bar Baz');
    });

    it('should work for three word inputs with separator and split', () => {
      const caps = helpers.toCaps('foo-bar-baz', ' ', '-');
      expect(caps, 'to equal', 'Foo Bar Baz');
    });
  });

  describe('toBuffer()', () => {
    it('should throw error for undefined', () => {
      expect(helpers.toBuffer.bind(), 'to throw', /Invalid/);
    });

    it('should work for string input', () => {
      const buf = helpers.toBuffer('foobar');
      expect(buf.toString('utf8'), 'to equal', 'foobar');
    });
  });

  describe('toHex()', () => {
    it('should throw error for undefined', () => {
      expect(helpers.toHex.bind(), 'to throw', /Invalid/);
    });

    it('should work for buffer input', () => {
      const hex = helpers.toHex(Buffer.from('cdab', 'hex'));
      expect(hex, 'to equal', 'cdab');
    });

    it('should work for Uint8Array input', () => {
      const hex = helpers.toHex(new Uint8Array([0xcd, 0xab]));
      expect(hex, 'to equal', 'cdab');
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

  describe('isLnUri()', () => {
    it('should accept lightning uri', () => {
      const uri =
        'lightning:lntb1500n1pdn2e0app5wlyxzspccpfvqmrtfr8p487xcch4hxtu2u0qzcke6mzpv222w8usdpa2fjkzep6ypxx2ap8wvs8qmrp0ysxzgrvd9nksarwd9hxwgrwv468wmmjdvsxwcqzysmr9jxv06zx53cyqa0sqntehy5tyrqu064xvw00qjep5f9gw57qcqp6qnpqyuprh90aqzfyf9ypq8uth7qte5ecjq0fng3y47mywwkfqq3megny';
      expect(helpers.isLnUri(uri), 'to be', true);
    });

    it('should reject bitcoin uri', () => {
      const uri = 'bitcoin:rfu4i1Mo2NF7TQsN9bMVLFSojSzcyQCEH5';
      expect(helpers.isLnUri(uri), 'to be', false);
    });

    it('should reject bitcoin address', () => {
      const uri = 'rfu4i1Mo2NF7TQsN9bMVLFSojSzcyQCEH5';
      expect(helpers.isLnUri(uri), 'to be', false);
    });

    it('should reject lightning invoice', () => {
      const uri =
        'lntb1500n1pdn2e0app5wlyxzspccpfvqmrtfr8p487xcch4hxtu2u0qzcke6mzpv222w8usdpa2fjkzep6ypxx2ap8wvs8qmrp0ysxzgrvd9nksarwd9hxwgrwv468wmmjdvsxwcqzysmr9jxv06zx53cyqa0sqntehy5tyrqu064xvw00qjep5f9gw57qcqp6qnpqyuprh90aqzfyf9ypq8uth7qte5ecjq0fng3y47mywwkfqq3megny';
      expect(helpers.isLnUri(uri), 'to be', false);
    });

    it('should mitigate xss', () => {
      const uri =
        'lightning:lntb1500n1<script>alert("XSS")</script>p487xcch4hxtu2u0qzcke6mzpv222w8usdpa2fjkzep6ypxx2ap8wvs8qmrp0ysxzgrvd9nksarwd9hxwgrwv468wmmjdvsxwcqzysmr9jxv06zx53cyqa0sqntehy5tyrqu064xvw00qjep5f9gw57qcqp6qnpqyuprh90aqzfyf9ypq8uth7qte5ecjq0fng3y47mywwkfqq3megny';
      expect(helpers.isLnUri(uri), 'to be', false);
    });
  });

  describe('isAddress()', () => {
    it('should accept bitcoin address', () => {
      const address = 'rfu4i1Mo2NF7TQsN9bMVLFSojSzcyQCEH5';
      expect(helpers.isAddress(address), 'to be', true);
    });

    it('should accept bech32 address', () => {
      const address =
        'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3';
      expect(helpers.isAddress(address), 'to be', true);
    });

    it('should accept p2wkh address', () => {
      const address = 'tb1q94yln7u75nt580a6s0gvs9wqvmfl4zgcxj78sw';
      expect(helpers.isAddress(address), 'to be', true);
    });

    it('should reject invalid bitcoin address', () => {
      const address = '/INVALID/rfu4i1Mo2NF7TQsN9bMVLFSoj';
      expect(helpers.isAddress(address), 'to be', false);
    });

    it('should mitigate xss', () => {
      const address = 'rfu<script>alert("XSS")</script>';
      expect(helpers.isAddress(address), 'to be', false);
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

  describe('poll()', () => {
    it('should poll three times', async () => {
      let counter = 0;
      const stub = sinon.stub();
      const api = () =>
        new Promise(resolve => {
          stub();
          if (++counter === 3) resolve(true);
          else resolve(false);
        });
      const response = await helpers.poll(api, 1, 10);
      expect(response, 'to be true');
      expect(stub.callCount, 'to equal', 3);
    });

    it('should throw an error after ten retries', async () => {
      let counter = 0;
      const stub = sinon.stub();
      const api = () =>
        new Promise(resolve => {
          stub();
          if (++counter === 11) resolve(true);
          else resolve(false);
        });
      await expect(
        helpers.poll(api, 1, 10),
        'to be rejected with error satisfying',
        /retries/
      );
      expect(stub.callCount, 'to equal', 10);
    });
  });

  describe('retry()', () => {
    it('should retry 10 times', async () => {
      const stub = sinon.stub();
      const api = () =>
        new Promise((resolve, reject) => {
          stub();
          reject(new Error('Boom!'));
        });
      await expect(
        helpers.retry(api, 1, 10),
        'to be rejected with error satisfying',
        /Boom!/
      );
      expect(stub.callCount, 'to equal', 10);
    });

    it('should try 3 times and then work', async () => {
      let counter = 0;
      const stub = sinon.stub();
      const api = () =>
        new Promise((resolve, reject) => {
          stub();
          if (++counter === 3) resolve('foo');
          reject(new Error('Boom!'));
        });
      const response = await helpers.retry(api, 1);
      expect(response, 'to equal', 'foo');
      expect(stub.callCount, 'to equal', 3);
    });
  });

  describe('generateArc()', () => {
    it('should work for continuous spinner inputs', () => {
      const spinnerRadius = 40;
      const startAngle = 3.6000000000009593;
      const endAngle = 147.60000000000096;
      const svgPath = helpers.generateArc(
        spinnerRadius,
        spinnerRadius,
        spinnerRadius,
        startAngle,
        endAngle
      );
      expect(
        svgPath,
        'to equal',
        'M 40 40 L 61.4330717991593 73.77311702008096 A 40 40 0 0 0 42.51162078117321 0.0789308628691785 Z'
      );
    });

    it('should work for network spinner inputs', () => {
      const spinnerRadius = 40;
      const startAngle = 0;
      const endAngle = 158.39318884228678;
      const svgPath = helpers.generateArc(
        spinnerRadius,
        spinnerRadius,
        spinnerRadius,
        startAngle,
        endAngle
      );
      expect(
        svgPath,
        'to equal',
        'M 40 40 L 54.72940316966346 77.1893087091641 A 40 40 0 0 0 40 0 Z'
      );
    });
  });

  describe('getTimeTilAvailable()', () => {
    it('should format blocks to human-readable time', () => {
      const numBlocks = 463;
      const time = helpers.getTimeTilAvailable(numBlocks);
      expect(time, 'to equal', '3 days and 5 hours');
    });

    it('should error on undefined', () => {
      expect(
        helpers.getTimeTilAvailable.bind(undefined),
        'to throw',
        /Invalid/
      );
    });

    it('should work for 1 day and 1 hour', () => {
      const numBlocks = 150;
      const time = helpers.getTimeTilAvailable(numBlocks);
      expect(time, 'to equal', '1 day and 1 hour');
    });

    it('should work for 0', () => {
      const numBlocks = 0;
      const time = helpers.getTimeTilAvailable(numBlocks);
      expect(time, 'to equal', '0 days and 0 hours');
    });
  });
});
