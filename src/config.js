/**
 * @fileOverview this file is used to hardcode default settings for the app.
 */

module.exports.RETRY_DELAY = 1000;
module.exports.LND_INIT_DELAY = 5000;
module.exports.NOTIFICATION_DELAY = 5000;
module.exports.RATE_DELAY = 15 * 60 * 1000;
module.exports.PAYMENT_TIMEOUT = 60 * 1000;

module.exports.LND_PORT = 10006;
module.exports.LND_PEER_PORT = 10016;
module.exports.LND_REST_PORT = 8086;
module.exports.LND_PROFILING_PORT = 9096;

module.exports.NETWORK = 'testnet';
module.exports.BTCD_MINING_ADDRESS = 'rfu4i1Mo2NF7TQsN9bMVLFSojSzcyQCEH5';

const prefixName = 'lightning';
module.exports.PREFIX_NAME = prefixName;
module.exports.PREFIX_URI = `${prefixName}:`;

module.exports.DEFAULT_ROUTE = 'Welcome';
module.exports.MIN_PASSWORD_LENGTH = 8;
module.exports.MAX_LOG_LENGTH = 10000;
module.exports.RECOVERY_WINDOW = 250;

module.exports.UNITS = {
  sat: { display: 'SAT', displayLong: 'Satoshi', denominator: 1 },
  bit: { display: 'bits', displayLong: 'Bits', denominator: 100 },
  btc: { display: 'BTC', displayLong: 'Bitcoin', denominator: 100000000 },
};
module.exports.FIATS = {
  usd: { display: '$', displayLong: 'US Dollar' },
  eur: { display: '€', displayLong: 'Euro' },
  gbp: { display: '£', displayLong: 'British Pound' },
  aud: { display: '$', displayLong: 'Australian Dollar' },
  brl: { display: 'R$', displayLong: 'Brazilian Real' },
  cad: { display: '$', displayLong: 'Canadian Dollar' },
  chf: { display: 'CHF', displayLong: 'Swiss Franc' },
  clp: { display: '$', displayLong: 'Chilean Peso' },
  cny: { display: '¥', displayLong: 'Chinese Yuan' },
  dkk: { display: 'kr', displayLong: 'Danish Krone' },
  hkd: { display: '$', displayLong: 'Hong Kong Dollar' },
  inr: { display: '₹', displayLong: 'Indian Rupee' },
  isk: { display: 'kr', displayLong: 'Icelandic Króna' },
  jpy: { display: '¥', displayLong: 'Japanese Yen' },
  krw: { display: '₩', displayLong: 'South Korean Won' },
  nzd: { display: '$', displayLong: 'New Zealand Dollar' },
  rub: { display: 'RUB', displayLong: 'Russian Ruble' },
  sek: { display: 'kr', displayLong: 'Swedish Krona' },
  sgd: { display: '$', displayLong: 'Singapore Dollar' },
  thb: { display: '฿', displayLong: 'Thai Baht' },
  twd: { display: 'NT$', displayLong: 'New Taiwan Dollar' },
};
module.exports.DEFAULT_UNIT = 'btc';
module.exports.DEFAULT_FIAT = 'usd';
