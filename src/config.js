module.exports.RETRY_DELAY = 3000;
module.exports.NOTIFICATION_DELAY = 10000;

const prefixName = 'lightning';
module.exports.PREFIX_NAME = prefixName;
module.exports.PREFIX_URI = `${prefixName}:`;

module.exports.DEFAULT_UNIT = 'Bits';

module.exports.DEFAULT_ROUTE = 'Pay';
// module.exports.DEFAULT_ROUTE = 'Channels';
// module.exports.DEFAULT_ROUTE = 'Request';
// module.exports.DEFAULT_ROUTE = 'CreateChannel';
// module.exports.DEFAULT_ROUTE = 'Settings';
// module.exports.DEFAULT_ROUTE = 'Transactions';
// module.exports.DEFAULT_ROUTE = 'InitializeWallet';

// module.exports.MNEMONIC_WALLET = false;
module.exports.MNEMONIC_WALLET = true;

module.exports.MACAROONS_ENABLED = false;
// module.exports.MACAROONS_ENABLED = true;
