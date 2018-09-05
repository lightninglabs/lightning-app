/**
 * @fileOverview this file is used to hardcode default settings for the app.
 */

module.exports.RETRY_DELAY = 1000;
module.exports.LND_INIT_DELAY = 5000;
module.exports.NOTIFICATION_DELAY = 5000;
module.exports.RATE_DELAY = 15 * 60 * 1000;

module.exports.LND_PORT = 10009;
module.exports.LND_PEER_PORT = 10019;
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
};
module.exports.DEFAULT_UNIT = 'btc';
module.exports.DEFAULT_FIAT = 'usd';
