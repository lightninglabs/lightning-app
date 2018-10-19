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
    'react-navigation': path.resolve(
      __dirname,
      'node_modules/react-navigation'
    ),
    mobx: path.resolve(__dirname, 'node_modules/mobx'),
    'mobx-react': path.resolve(__dirname, 'node_modules/mobx-react'),
    'locale-currency': path.resolve(__dirname, 'node_modules/locale-currency'),
    '@storybook': path.resolve(__dirname, 'node_modules/@storybook'),
    'qr-image': path.resolve(__dirname, 'node_modules/qr-image'),
    stream: path.resolve(__dirname, 'node_modules/readable-stream'),
    zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
    sinon: path.resolve(__dirname, 'node_modules/sinon'),
  },
  getProjectRoots: () => [
    path.resolve(__dirname),
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../stories'),
  ],
};
