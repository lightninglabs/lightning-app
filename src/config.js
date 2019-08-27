/**
 * @fileOverview this file is used to hardcode default settings for the app.
 */

module.exports.RETRY_DELAY = 1000;
module.exports.LND_INIT_DELAY = 5000;
module.exports.NOTIFICATION_DELAY = 5000;
module.exports.RATE_DELAY = 15 * 60 * 1000;
module.exports.ATPL_DELAY = 60 * 60 * 1000;
module.exports.PAYMENT_TIMEOUT = 60 * 1000;
module.exports.POLL_STORE_TIMEOUT = 100;

module.exports.LND_NETWORK = 'testnet';
module.exports.LND_PORT = 10006;
module.exports.LND_PEER_PORT = 10016;
module.exports.LND_REST_PORT = 8086;
module.exports.LND_PROFILING_PORT = 9096;

module.exports.BTCD_MINING_ADDRESS = 'rfu4i1Mo2NF7TQsN9bMVLFSojSzcyQCEH5';

const prefixName = 'lightning';
module.exports.PREFIX_NAME = prefixName;
module.exports.PREFIX_URI = `${prefixName}:`;
module.exports.PREFIX_REGEX = /^[a-zA-Z]*:/;

module.exports.DEFAULT_ROUTE = 'Welcome';
module.exports.LOW_TARGET_CONF = 26;
module.exports.MED_TARGET_CONF = 16;
module.exports.HIGH_TARGET_CONF = 4;
module.exports.PIN_LENGTH = 6;
module.exports.MIN_PASSWORD_LENGTH = 8;
module.exports.STRONG_PASSWORD_LENGTH = 12;
module.exports.MAX_LOG_LENGTH = 10000;
module.exports.RECOVERY_WINDOW = 250;

module.exports.UNITS = {
  sat: { display: 'sats', displayLong: 'Satoshi', denominator: 1 },
  bit: { display: 'bits', displayLong: 'Bits', denominator: 100 },
  btc: { display: 'BTC', displayLong: 'Bitcoin', denominator: 100000000 },
};
module.exports.FIATS = {
  usd: { display: '$', displayLong: 'US Dollar' },
  eur: { display: '€', displayLong: 'Euro' },
  gbp: { display: '£', displayLong: 'British Pound' },
};
module.exports.DEFAULT_UNIT = 'sat';
module.exports.DEFAULT_FIAT = 'usd';
