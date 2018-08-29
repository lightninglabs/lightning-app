const path = require('path');

module.exports = {
  extraNodeModules: {
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
    'react-native-svg': path.resolve(
      __dirname,
      'node_modules/react-native-svg'
    ),
    mobx: path.resolve(__dirname, 'node_modules/mobx'),
    '@storybook': path.resolve(__dirname, 'node_modules/@storybook'),
    'qr-image': path.resolve(__dirname, 'node_modules/qr-image'),
    stream: path.resolve(__dirname, 'node_modules/readable-stream'),
    zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
  },
  getProjectRoots: () => [
    path.resolve(__dirname),
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../stories'),
  ],
};
