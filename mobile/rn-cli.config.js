const path = require('path');

module.exports = {
  getProjectRoots: () => [
    path.resolve(__dirname),
    path.resolve(__dirname, '../src'),
  ],
};
