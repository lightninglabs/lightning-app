module.exports.default = (args) => new Promise((resolve, reject) => {
  const fs = require('fs');
  fs.appendFile('./src/config.js', 'module.exports.AUTO_UPDATE_ENABLED = true;', err => {
    if (err) {
      console.log(`errored enabling auto update: ${err}`);
      reject(err);
    }
  });
  resolve(true);
});
