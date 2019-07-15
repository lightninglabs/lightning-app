const path = require('path');

module.exports = {
  resolver: {
    extraNodeModules: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'expo-font': path.resolve(__dirname, 'node_modules/expo-font'),
      'expo-random': path.resolve(__dirname, 'node_modules/expo-random'),
      'expo-keep-awake': path.resolve(
        __dirname,
        'node_modules/expo-keep-awake'
      ),
      'expo-permissions': path.resolve(
        __dirname,
        'node_modules/expo-permissions'
      ),
      'expo-local-authentication': path.resolve(
        __dirname,
        'node_modules/expo-local-authentication'
      ),
      'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
      'react-native-svg': path.resolve(
        __dirname,
        'node_modules/react-native-svg'
      ),
      'react-navigation': path.resolve(
        __dirname,
        'node_modules/react-navigation'
      ),
      'react-native-keychain': path.resolve(
        __dirname,
        'node_modules/react-native-keychain'
      ),
      'react-native-camera': path.resolve(
        __dirname,
        'node_modules/react-native-camera'
      ),
      'react-native-fs': path.resolve(
        __dirname,
        'node_modules/react-native-fs'
      ),
      mobx: path.resolve(__dirname, 'node_modules/mobx'),
      'mobx-react': path.resolve(__dirname, 'node_modules/mobx-react'),
      'locale-currency': path.resolve(
        __dirname,
        'node_modules/locale-currency'
      ),
      'qr-image': path.resolve(__dirname, 'node_modules/qr-image'),
      stream: path.resolve(__dirname, 'node_modules/readable-stream'),
      zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
      'base64-js': path.resolve(__dirname, 'node_modules/base64-js'),
      protobufjs: path.resolve(__dirname, 'node_modules/protobufjs'),
      sinon: path.resolve(__dirname, 'node_modules/sinon'),
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
      'react-native-dropdownalert': path.resolve(
        __dirname,
        'node_modules/react-native-dropdownalert'
      ),
    },
  },
  projectRoot: path.resolve(__dirname),
  watchFolders: [
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../assets'),
  ],
};
